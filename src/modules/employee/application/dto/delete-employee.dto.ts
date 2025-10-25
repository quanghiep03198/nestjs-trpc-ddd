import z from 'zod'
import { ContractType, EmployeeStatus } from '../../domain/constants'

export const deleteEmployeeDto = z.object({
	employee_code: z
		.string()
		.nonempty()
		.regex(/^S\d+$/, 'Invalid employee code format. It should start with "S" followed by digits.'),
	status: z.enum([
		EmployeeStatus.RESIGNED,
		EmployeeStatus.TERMINATED,
		EmployeeStatus.RETIRED,
		EmployeeStatus.DECEASED
	]),
	contract_type: z.enum(ContractType)
})

export type DeleteEmployeeDto = z.infer<typeof deleteEmployeeDto>
