import z from 'zod'

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
	gender: z.enum(['male', 'female', 'other']),
	identity_number: z.string().regex(/^[0-9]{12}$/),
	identity_date: z.coerce.date(),
	identity_place: z.string(),
	marital_status: z.enum(['single', 'married', 'divorced', 'widowed']),
	nationality: z.string().nullable(),

	// Contact info
	phone: z.string(),
	email: z.string().email().nullable(),
	address: z.string().nullable(),

	// Work info
	department_id: z.number().nullable(),
	position_id: z.number().nullable(),
	job_level: z.string().nullable(),
	start_date: z.coerce.date(),
	contract_end_date: z.coerce.date(),
	contract_type: z.enum([
		'indefinite_term',
		'fixed_term',
		'seasonal',
		'internship',
		'probationary',
		'part-time',
		'apprenticeship'
	]),
	status: z.enum(['active', 'probation', 'on_leave', 'resigned', 'retired', 'deceased', 'suspended', 'terminated']),

	// Insurance info
	social_insurance_number: z
		.string()
		.regex(/^[0-9]{10}$/)
		.nullable(),

	// Other
	avatar_url: z.string().url().nullable()
})

// Schema cho response danh sách Employee

export type EmployeeDto = z.infer<typeof employeeDto>
