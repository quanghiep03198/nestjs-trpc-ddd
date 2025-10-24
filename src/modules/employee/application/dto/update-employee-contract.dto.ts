import z from 'zod'
import { employeeDto } from '.'

export const updateEmployeeContractDto = employeeDto.pick({
	employee_code: true,
	status: true,
	contract_type: true,
	contract_end_date: true
})

export type UpdateEmployeeContractDto = z.infer<typeof updateEmployeeContractDto>
