import { PositionEntity } from '@/modules/employee/infrastructure/entities/position.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export class PositionSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		const positionRepository = dataSource.getRepository(PositionEntity)
		const departmentRepository = dataSource.getRepository('DepartmentEntity')
		const positionFactory = factoryManager.get(PositionEntity)

		// Check if positions already exist
		const count = await positionRepository.count()
		if (count > 0) {
			console.log('Positions already exist, skipping...')
			return
		}

		// Get departments
		const departments = await departmentRepository.find()
		if (departments.length === 0) {
			console.log('⚠️  No departments found. Please run department seeder first.')
			return
		}

		// Create positions for each department
		const positionTemplates = [
			{ name: 'Director', level: 5, minSalary: 100000, maxSalary: 200000 },
			{ name: 'Manager', level: 10, minSalary: 80000, maxSalary: 150000 },
			{ name: 'Team Lead', level: 20, minSalary: 60000, maxSalary: 120000 },
			{ name: 'Senior', level: 30, minSalary: 50000, maxSalary: 100000 },
			{ name: 'Mid-Level', level: 40, minSalary: 40000, maxSalary: 80000 },
			{ name: 'Junior', level: 50, minSalary: 30000, maxSalary: 60000 },
			{ name: 'Intern', level: 100, minSalary: 10000, maxSalary: 25000 }
		]

		for (const dept of departments) {
			for (const template of positionTemplates) {
				const position = await positionFactory.make({
					code: `POS_${dept.code}_${template.name.toUpperCase().replace(/\s+|-/g, '_')}`,
					name: `${dept.name} ${template.name}`,
					description: `${template.name} position in ${dept.name}`,
					level: template.level,
					min_salary: template.minSalary,
					max_salary: template.maxSalary,
					department_id: dept.id,
					requirements: JSON.stringify({
						education: template.level <= 10 ? 'Master' : template.level <= 40 ? 'Bachelor' : 'High School',
						experience: Math.floor((100 - template.level) / 10),
						skills: ['Communication', 'Teamwork', 'Problem Solving']
					})
				})

				await positionRepository.save(position)
				console.log(`Created position: ${position.code} in department ${dept.code}`)
			}
		}

		console.log('Position seeding completed!')
	}
}
