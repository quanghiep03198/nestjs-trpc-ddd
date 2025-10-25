import { DepartmentEntity } from '@/modules/employee/infrastructure/entities/department.entity'
import { faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(DepartmentEntity, () => {
	const department = new DepartmentEntity()

	const departmentTypes = [
		'Engineering',
		'Human Resources',
		'Finance',
		'Marketing',
		'Sales',
		'Operations',
		'Customer Support',
		'Product',
		'Design',
		'Legal',
		'IT',
		'Quality Assurance'
	]

	const name = faker.helpers.arrayElement(departmentTypes)
	const code = name.toUpperCase().replace(/\s+/g, '_')

	department.code = `DEPT_${code}_${faker.string.alphanumeric(4).toUpperCase()}`

	// Parent department (will be set by seeder for hierarchical structure)
	department.parent_id = null

	// Manager (will be set by seeder after employees are created)
	department.manager_id = null

	department.phone = faker.phone.number({ style: 'international' })
	department.location = `${faker.location.buildingNumber()} ${faker.location.street()}, Floor ${faker.number.int({ min: 1, max: 10 })}`

	return department
})
