import z from 'zod'
import { ContractType, EmployeeStatus, Gender, MaritalStatus } from '../../domain/constants'

// Schema cho response Employee (bao gồm tất cả fields)
export const employeeDto = z.object({
	// Base fields
	id: z.any(),
	created_at: z.coerce.date().nullable(),
	updated_at: z.coerce.date().nullable(),
	deleted: z.boolean().nullish(),
	deleted_at: z.coerce.date().nullish(),
	created_by: z.string().nullable(),
	updated_by: z.string().nullable(),
	remark: z.string().nullable(),

	// Employee specific fields
	employee_code: z.string(),
	full_name: z.string().nonempty(),
	date_of_birth: z.coerce.date(),
	gender: z.enum(Gender),
	identity_number: z.string().regex(/^[0-9]{12}$/),
	identity_date: z.coerce.date(),
	identity_place: z.string(),
	marital_status: z.enum(MaritalStatus),
	nationality: z.string().nullable(),

	// Contact info
	phone: z.string(),
	email: z.email().nullable(),
	address: z.string().nullable(),

	// Work info
	department_id: z.number().nullable(),
	position_id: z.number().nullable(),
	job_level: z.string().nullable(),
	start_date: z.coerce.date(),
	contract_end_date: z.coerce.date(),
	contract_type: z.enum(ContractType),
	status: z.enum(EmployeeStatus),

	// Insurance info
	social_insurance_number: z
		.string()
		.regex(/^[0-9]{10}$/)
		.nullable(),

	// Other
	avatar_url: z.url().nullable()
})

// Schema cho response danh sách Employee

export type EmployeeDto = z.infer<typeof employeeDto>
