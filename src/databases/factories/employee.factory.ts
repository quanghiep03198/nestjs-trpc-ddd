import { ContractType, EmployeeStatus, Gender, MaritalStatus } from '@/modules/employee/domain/constants'
import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { faker } from '@faker-js/faker'
import { addYears, subYears } from 'date-fns'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(EmployeeEntity, () => {
	const employee = new EmployeeEntity({})

	// User reference (will be set by seeder if creating linked account)
	employee.user_id = null

	// Basic info
	employee.employee_code = `EMP${faker.string.numeric(6)}`
	employee.full_name = faker.person.fullName()
	employee.date_of_birth = faker.date.birthdate({ min: 22, max: 60, mode: 'age' })
	employee.gender = faker.helpers.arrayElement(Object.values(Gender))
	employee.avatar_url = faker.image.avatar()

	// Identification
	employee.identity_number = faker.string.numeric(12)
	employee.identity_date = subYears(employee.date_of_birth, -18) // Issued after 18 years old
	employee.identity_place = faker.location.city()
	employee.marital_status = faker.helpers.arrayElement(Object.values(MaritalStatus))
	employee.nationality = faker.helpers.arrayElement(['Việt Nam', 'Vietnam', 'USA', 'China', 'Japan'])
	employee.social_insurance_number = faker.string.numeric(10)

	// Contact info
	employee.phone = faker.phone.number({ style: 'international' })
	employee.email = faker.internet.email({ provider: 'company.com' }).toLowerCase()
	employee.address = faker.location.streetAddress({ useFullAddress: true })

	// Job info (will be set by seeder to ensure valid references)
	employee.department_id = null
	employee.position_id = null
	employee.job_level = faker.helpers.arrayElement(['junior', 'mid', 'senior', 'lead', 'manager', 'director'])
	employee.start_date = faker.date.past({ years: 5 })

	// Contract info
	employee.contract_type = faker.helpers.arrayElement(Object.values(ContractType))

	// Set contract end date based on type
	if (employee.contract_type === ContractType.INDEFINITE_TERM) {
		employee.contract_end_date = null
	} else {
		employee.contract_end_date = addYears(employee.start_date, faker.number.int({ min: 1, max: 3 }))
	}

	// Status
	employee.status = faker.helpers.arrayElement(Object.values(EmployeeStatus))

	return employee
})
