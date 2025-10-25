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
		const mainDepartments = []

		const createdMainDepartments: DepartmentEntity[] = []

		for (const deptData of mainDepartments) {
			const department = await departmentFactory.make(deptData)
			const saved = await departmentRepository.save(department)
			createdMainDepartments.push(saved)
			console.log(`Created main department: ${saved.code}`)
		}

		// Create sub-departments (with parent)
		const subDepartments = [
			// Engineering sub-departments
			{
				code: 'DEPT_FRONTEND',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_ENGINEERING')
			},
			{
				code: 'DEPT_BACKEND',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_ENGINEERING')
			},
			{
				code: 'DEPT_DEVOPS',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_ENGINEERING')
			},
			// HR sub-departments
			{
				code: 'DEPT_RECRUITMENT',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_HR')
			},
			{
				code: 'DEPT_TRAINING',
				parent: createdMainDepartments.find((d) => d.code === 'DEPT_HR')
			}
		]

		for (const subDeptData of subDepartments) {
			const department = await departmentFactory.make({
				code: subDeptData.code,
				parent_id: subDeptData.parent?.id
			})
			const saved = await departmentRepository.save(department)
			console.log(`Created sub-department: ${saved.code} (parent: ${subDeptData.parent?.code})`)
		}

		console.log('Department seeding completed!')
	}
}
