import z from 'zod'
import { EmployeeStatus, Gender } from '../../domain/constants'

// Schema cho query Employee list
export const employeeQueryDto = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(10),
	search: z.string().optional(),
	department_id: z.number().int().optional(),
	position_id: z.number().int().optional(),
	status: z.enum(EmployeeStatus).optional(),
	gender: z.enum(Gender).optional(),
	sort_by: z.enum(['employee_code', 'full_name', 'start_date', 'created_at']).default('created_at'),
	sort_order: z.enum(['ASC', 'DESC']).default('DESC')
})

export type EmployeeQuerySchema = z.infer<typeof employeeQueryDto>
