import { env } from '@/common/utils'
import { Logger } from '@nestjs/common'
import 'dotenv/config'
import { isIP } from 'node:net'
import { join } from 'node:path'
import { DataSource, DataSourceOptions } from 'typeorm'
import { type SeederOptions } from 'typeorm-extension'
import { DATABASE_SYSCLOUD } from './constants'
// import {
// 	DepartmentFactory,
// 	EmployeeFactory,
// 	PermissionFactory,
// 	PositionFactory,
// 	RoleFactory,
// 	UserFactory,
// 	UserRoleFactory
// } from './factories'
// import {
// 	DepartmentSeeder,
// 	EmployeeSeeder,
// 	PermissionSeeder,
// 	PositionSeeder,
// 	RoleSeeder,
// 	UserRoleSeeder,
// 	UserSeeder
// } from './seeds'

const logger = new Logger('TypeORM')

const DB_HOST = env('SEEDING_DB_HOST') || env('MIGRATION_DB_HOST') || env('DB_HOST')

if (!DB_HOST) {
	logger.error('Please provide a database host')
	process.exit()
}

if (isIP(DB_HOST.trim()) === 0) {
	logger.error('Please provide a valid IP address for the database host')
	process.exit()
}

export default new DataSource({
	host: DB_HOST,
	port: env('DB_PORT', { serialize: (value) => Number.parseInt(value) }),
	type: env('DB_TYPE'),
	username: env('DB_USERNAME'),
	password: env('DB_PASSWORD'),
	database: DATABASE_SYSCLOUD,
	// Note: Không set schema ở đây vì sẽ gây conflict với SQL Server
	// Schema được chỉ định trực tiếp trong table name: database.schema.table
	migrations: [join(__dirname, './migrations/**/*{.ts,.js}')],
	seeds: ['src/databases/seeds/**/*.seeder{.ts,.js}'],
	factories: ['src/databases/factories/**/*.factory{.ts,.js}'],
	entities: [join(__dirname, '../**/*.entity.{ts,js}'), join(__dirname, './**/*.entity{.ts,.js}')],
	subscribers: [join(__dirname, '../**/*.entity.subscriber{.ts,.js}')],
	migrationsTableName: 'migrations',
	logging: true,
	synchronize: false,
	options: {
		trustServerCertificate: true,
		encrypt: false,
		enableArithAbort: true
	}
} as DataSourceOptions & SeederOptions)
