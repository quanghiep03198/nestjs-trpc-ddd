import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export class EmployeeSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		const employeeRepository = dataSource.getRepository(EmployeeEntity)
		const departmentRepository = dataSource.getRepository('DepartmentEntity')
		const positionRepository = dataSource.getRepository('PositionEntity')
		const employeeFactory = factoryManager.get(EmployeeEntity)

		// Check if employees already exist
		const count = await employeeRepository.count()
		if (count > 0) {
			console.log('Employees already exist, skipping...')
			return
		}

		// Get departments and positions
		const departments = await departmentRepository.find()
		const positions = await positionRepository.find()

		if (departments.length === 0 || positions.length === 0) {
			console.log('⚠️  No departments or positions found. Please run department and position seeders first.')
			return
		}

		// Create 100 employees
		const employeeCount = 100
		const createdEmployees: EmployeeEntity[] = []

		for (let i = 0; i < employeeCount; i++) {
			// Randomly assign department and position from that department
			const department = departments[Math.floor(Math.random() * departments.length)]
			const departmentPositions = positions.filter((p) => p.department_id === department.id)
			const position =
				departmentPositions.length > 0
					? departmentPositions[Math.floor(Math.random() * departmentPositions.length)]
					: positions[Math.floor(Math.random() * positions.length)]

			const employee = await employeeFactory.make({
				department_id: department.id,
				position_id: position.id
			})

			const saved = await employeeRepository.save(employee)
			createdEmployees.push(saved)

			if ((i + 1) % 20 === 0) {
				console.log(`Created ${i + 1}/${employeeCount} employees...`)
			}
		}

		// Assign managers to departments (use senior employees)
		for (const dept of departments) {
			const deptEmployees = createdEmployees.filter((e) => e.department_id === dept.id)
			if (deptEmployees.length > 0) {
				// Pick first employee as manager
				const manager = deptEmployees[0]
				dept.manager_id = manager.id
				await departmentRepository.save(dept)
				console.log(`// @ts-nocheck
Assigned manager ${manager.full_name} to department ${dept.name}`)
			}
		}

		console.log(`Employee seeding completed! Created ${employeeCount} employees.`)
	}
}
