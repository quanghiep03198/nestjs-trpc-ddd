import z from 'zod'

export const createUserDTO = z.object({
	email: z.email(),
	password: z.string().min(6, {
		error: (issue) => {
			return `Username must have at least ${issue.minimum} characters`
		}
	})
})

export type CreateUserDTO = z.infer<typeof createUserDTO>
