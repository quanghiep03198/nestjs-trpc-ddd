import { CreateEmployeeHandler } from './create-employee/create-employee.handler'
import { DeleteEmployeeHandler } from './delete-employee/delete-employee.handler'
import { UpdateEmployeeContractHandler } from './update-employee-contract/update-employee-contract.handler'
import { UpdateEmployeeProfileHandler } from './update-employee-profile/update-employee-profile.handler'

export const EmployeeCommandHandlers = [
	CreateEmployeeHandler,
	UpdateEmployeeProfileHandler,
	DeleteEmployeeHandler,
	UpdateEmployeeContractHandler
]
