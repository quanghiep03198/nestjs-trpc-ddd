import { Role } from '@/modules/auth/domain/constants'
import { UserRoleEntity } from '@/modules/auth/infrastructure/entities/user-role.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export class UserRoleSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		const userRoleRepository = dataSource.getRepository(UserRoleEntity)
		const userRepository = dataSource.getRepository('UserEntity')
		const employeeRepository = dataSource.getRepository('EmployeeEntity')
		const userRoleFactory = factoryManager.get(UserRoleEntity)

		// Check if user roles already exist
		const count = await userRoleRepository.count()
		if (count > 0) {
			console.log('  User roles already exist, skipping...')
			return
		}

		// Get all users and employees
		const users = await userRepository.find()
		const employees = await employeeRepository.find()

		if (users.length === 0) {
			console.log('  No users found. Please run user seeder first.')
			return
		}

		// Assign admin role to admin user
		const adminUser = users.find((u) => u.email === 'admin@gmail.com')
		if (adminUser) {
			const userRole = await userRoleFactory.make({
				user_id: adminUser.id,
				role: Role.ADMIN,
				assigned_by: 'system',
				expires_at: null
			})
			await userRoleRepository.save(userRole)
			console.log(`  ✓ Assigned ADMIN role to ${adminUser.email}`)
		}

		// Assign roles to employee users based on job level or position
		for (const user of users) {
			if (user.email === 'admin@gmail.com') continue

			// Find linked employee
			const employee = employees.find((e) => e.user_id === user.id)
			if (!employee) continue

			// Determine role based on job level
			let assignedRole: Role = Role.EMPLOYEE

			if (employee.job_level === 'manager' || employee.job_level === 'director') {
				assignedRole = Role.HR_MANAGER
			}

			// Check if role already assigned
			const exists = await userRoleRepository.exists({
				where: {
					user_id: user.id,
					role: assignedRole
				}
			})

			if (!exists) {
				const userRole = await userRoleFactory.make({
					user_id: user.id,
					role: assignedRole,
					assigned_by: 'system',
					expires_at: null
				})
				await userRoleRepository.save(userRole)
				console.log(`  ✓ Assigned ${assignedRole} role to ${employee.full_name}`)
			}
		}

		console.log('  ✓ User-Role seeding completed')
	}
}
