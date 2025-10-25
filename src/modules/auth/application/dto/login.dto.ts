import z from 'zod'

export const loginDTO = z.object({
	email: z.email('Invalid email address'),
	password: z.string().nonempty()
})

export type LoginDTO = z.infer<typeof loginDTO>
