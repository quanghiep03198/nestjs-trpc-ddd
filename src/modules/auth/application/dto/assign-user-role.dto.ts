import z from 'zod'
import { Role } from '../../domain/constants'

export const assignUserRoleDTO = z.object({
	user_id: z.int().positive(),
	role: z.enum(Role)
})

export type AssignUserRoleDTO = z.infer<typeof assignUserRoleDTO>
