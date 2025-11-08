import { DepartmentEntity } from '@/modules/employee/infrastructure/entities/department.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export class DepartmentSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		const departmentRepository = dataSource.getRepository(DepartmentEntity)
		const departmentFactory = factoryManager.get(DepartmentEntity)

		// Check if departments already exist
		const count = await departmentRepository.count()
		if (count > 0) {
			console.log('Departments already exist, skipping...')
			return
		}

		// Create main departments (no parent)
		const mainDepartments = [
			{ code: 'DEPT_ENGINEERING', name: 'Engineering' },
			{ code: 'DEPT_HR', name: 'Human Resources' },
			{ code: 'DEPT_FINANCE', name: 'Finance' },
			{ code: 'DEPT_MARKETING', name: 'Marketing' },
			{ code: 'DEPT_SALES', name: 'Sales' }
		]

		const createdMainDepartments: DepartmentEntity[] = []

		for (const deptData of mainDepartments) {
			const department = await departmentFactory.make(deptData)
			const saved = await departmentRepository.save(department)
			createdMainDepartments.push(saved)
			console.log(`  ✓ Created main department: ${saved.name} (${saved.code})`)
		}

		// Create sub-departments (with parent)
		const subDepartments = [
			// Engineering sub-departments
			{
				code: 'DEPT_FRONTEND',
				name: 'Frontend Development',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_ENGINEERING')
			},
			{
				code: 'DEPT_BACKEND',
				name: 'Backend Development',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_ENGINEERING')
			},
			{
				code: 'DEPT_DEVOPS',
				name: 'DevOps',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_ENGINEERING')
			},
			// HR sub-departments
			{
				code: 'DEPT_RECRUITMENT',
				name: 'Recruitment',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_HR')
			},
			{
				code: 'DEPT_TRAINING',
				name: 'Training & Development',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_HR')
			}
		]

		for (const subDeptData of subDepartments) {
			const department = await departmentFactory.make({
				code: subDeptData.code,
				name: subDeptData.name,
				parent_id: subDeptData.parent?.id
			})
			const saved = await departmentRepository.save(department)
			console.log(`  ✓ Created sub-department: ${saved.name} (${saved.code}, parent: ${subDeptData.parent?.code})`)
		}

		console.log('  ✓ Department seeding completed')
	}
}
