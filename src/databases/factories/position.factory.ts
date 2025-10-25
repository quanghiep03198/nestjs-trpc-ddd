import { PositionEntity } from '@/modules/employee/infrastructure/entities/position.entity'
import { faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(PositionEntity, () => {
	const position = new PositionEntity()

	const positions = [
		{ name: 'CEO', level: 1, minSalary: 150000, maxSalary: 300000 },
		{ name: 'CTO', level: 2, minSalary: 120000, maxSalary: 250000 },
		{ name: 'Director', level: 5, minSalary: 100000, maxSalary: 200000 },
		{ name: 'Manager', level: 10, minSalary: 80000, maxSalary: 150000 },
		{ name: 'Team Lead', level: 20, minSalary: 60000, maxSalary: 120000 },
		{ name: 'Senior Engineer', level: 30, minSalary: 50000, maxSalary: 100000 },
		{ name: 'Engineer', level: 40, minSalary: 40000, maxSalary: 80000 },
		{ name: 'Junior Engineer', level: 50, minSalary: 30000, maxSalary: 60000 },
		{ name: 'Intern', level: 100, minSalary: 10000, maxSalary: 25000 }
	]

	const positionData = faker.helpers.arrayElement(positions)

	position.code = `POS_${positionData.name.toUpperCase().replace(/\s+/g, '_')}_${faker.string.alphanumeric(4).toUpperCase()}`
	position.name = positionData.name
	position.description = faker.lorem.sentence()
	position.level = positionData.level
	position.min_salary = positionData.minSalary
	position.max_salary = positionData.maxSalary

	// Department will be set by seeder
	position.department_id = null

	// Requirements (stored as JSON)
	position.requirements = JSON.stringify({
		education: faker.helpers.arrayElement(['Bachelor', 'Master', 'PhD', 'High School']),
		experience: faker.number.int({ min: 0, max: 10 }),
		skills: faker.helpers.arrayElements(['JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'SQL'], 3)
	})

	return position
})
