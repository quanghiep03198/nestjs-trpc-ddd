import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity'
import { format } from 'date-fns'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export class UserSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		const userRepository = dataSource.getRepository(UserEntity)
		const employeeRepository = dataSource.getRepository(EmployeeEntity)
		const userFactory = factoryManager.get(UserEntity)

		// Check if users already exist
		const count = await userRepository.count()
		if (count > 0) {
			console.log('Users already exist, skipping...')
			return
		}

		// Get all employees
		const employees = await employeeRepository.find()
		if (employees.length === 0) {
			console.log('No employees found. Please run employee seeder first.')
			return
		}

		// Create 1 admin user (not linked to employee)
		const admin = await userFactory.make({
			email: 'admin@gmail.com',
			password: '123123',
			status: 'active',
			email_verified_at: new Date()
		})
		const savedAdmin = await userRepository.save(admin)
		console.log(`Created admin user: ${savedAdmin.email}`)

		// Create users for 50% of employees
		const employeeCount = Math.floor(employees.length * 0.5)
		const selectedEmployees = employees.slice(0, employeeCount)

		const createEmail = (employee: EmployeeEntity) => {
			return (
				employee.full_name
					.split(' ')
					.map((part) => part.trim().toLowerCase())
					.join('') +
				format(employee.date_of_birth, 'yyyyMMdd') +
				'@gmail.com'
			)
		}

		for (const employee of selectedEmployees) {
			// Create user linked to employee
			const user = await userFactory.make({
				email: employee.email || createEmail(employee),
				password: employee.employee_code.toLowerCase(),
				status: 'active',
				email_verified_at: new Date()
			})

			const savedUser = await userRepository.save(user)

			// Link employee to user
			employee.user_id = savedUser.id
			await employeeRepository.save(employee)

			console.log(`Created user for employee: ${employee.full_name} (${savedUser.email})`)
		}

		console.log(`User seeding completed! Created 1 admin + ${employeeCount} employee users.`)
	}
}
