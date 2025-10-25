import { Logger } from '@nestjs/common'
import z from 'zod'

export const configSchema = z.object({
	// * MSSQL
	DB_HOST: z.ipv4(),
	DB_TYPE: z.literal('mssql'),
	DB_USERNAME: z.string().nonempty(),
	DB_PASSWORD: z.string().nonempty(),
	DB_PORT: z
		.string()
		.refine((value) => !Number.isNaN(+value))
		.transform((value) => +value),
	DB_TRUST_SERVER_CERTIFICATE: z.enum(['true', 'false']).transform((value) => value === 'true'),
	DB_CONNECTION_TIMEOUT: z
		.string()
		.refine((value) => !Number.isNaN(+value))
		.transform((value) => +value),

	// * Redis
	REDIS_HOST: z.ipv4(),
	REDIS_PORT: z
		.string()
		.trim()
		.nonempty()
		.default('6379')
		.refine((value) => !Number.isNaN(+value))
		.transform((value) => +value),
	REDIS_PASSWORD: z.string().trim().nonempty(),
	REDIS_DB: z
		.string()
		.trim()
		.nonempty()
		.default('0')
		.refine((value) => !Number.isNaN(+value))
		.transform((value) => +value),

	// * Bcrypt
	SALT_ROUND: z
		.string()
		.refine((value) => !Number.isNaN(+value))
		.transform((value) => +value),

	// * JWT
	JWT_SECRET: z.string().nonempty(),
	JWT_ACCESS_TOKEN_EXPIRES: z.string().nonempty(),
	JWT_REFRESH_TOKEN_EXPIRES: z.string().nonempty()
})

export const validateConfigAsync = async (config: Record<string, any>) => {
	try {
		return await configSchema.parseAsync(config)
	} catch (error) {
		Logger.error(error)
		throw error
	}
}
