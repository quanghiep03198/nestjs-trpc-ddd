import { env } from '@/common/utils'
import { DATABASE_SCHEMA } from '@/databases/constants'
import { PermissionEntity, RolePermissionEntity, UserRoleEntity } from '@/modules/auth/infrastructure/entities'
import { DepartmentEntity, EmployeeEntity, PositionEntity } from '@/modules/employee/infrastructure/entities'
import { EmployeeEntitySubscriber } from '@/modules/employee/infrastructure/subscribers'
import { UserEntity } from '@/modules/user/infrastructure/entities'
import { type ConfigFactory } from '@nestjs/config'
import { type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export const typeOrmConfigFactory: ConfigFactory<Record<'typeorm', TypeOrmModuleOptions>> = () => ({
	['typeorm']: {
		type: 'mssql',
		host: env('DB_HOST'),
		port: env('DB_PORT', { serialize: (value): number => Number.parseInt(value) }),
		username: env('DB_USERNAME'),
		password: env('DB_PASSWORD'),
		schema: DATABASE_SCHEMA,
		entities: [
			UserEntity,
			PermissionEntity,
			UserRoleEntity,
			RolePermissionEntity,
			EmployeeEntity,
			DepartmentEntity,
			PositionEntity
		],
		subscribers: [EmployeeEntitySubscriber],
		autoLoadEntities: true,
		synchronize: true,
		logging: ['error'],
		requestTimeout: 30000,
		namingStrategy: new SnakeNamingStrategy(),
		cache: {
			type: 'redis',
			options: {
				socket: {
					host: env('REDIS_HOST'),
					port: env('REDIS_PORT', { serialize: (value): number => Number.parseInt(value) })
				},
				db: env('REDIS_DB', { fallbackValue: 1, serialize: (value): number => Number.parseInt(value) }),
				password: env('REDIS_PASSWORD')
			},
			ignoreErrors: false
		},
		pool: {
			max: 100,
			min: 5,
			acquireTimeoutMillis: 30000
		},
		options: {
			trustServerCertificate: env('DB_TRUST_SERVER_CERTIFICATE', {
				serialize: (value): boolean => value === 'true'
			}),
			encrypt: false,
			enableArithAbort: true,
			connectTimeout: env('DB_CONNECTION_TIMEOUT', { serialize: (value): number => Number.parseInt(value) }),
			abortTransactionOnError: true,
			isolation: 'SNAPSHOT'
		},
		extra: {
			connectionLimit: 100,
			connectTimeout: 30000,
			acquireTimeout: 30000
		}
	}
})
