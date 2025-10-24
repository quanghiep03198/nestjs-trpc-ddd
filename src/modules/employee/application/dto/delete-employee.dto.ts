import z from 'zod'

export const deleteEmployeeDto = z.object({
	employee_code: z
		.string()
		.nonempty()
		.regex(/^S\d+$/, 'Mã nhân viên không hợp lệ'),
	status: z.enum(['resigned', 'terminated', 'retired', 'deceased'])
})

export type DeleteEmployeeDto = z.infer<typeof deleteEmployeeDto>
