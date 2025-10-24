import { EmployeeEntity } from '@/modules/employee/infrastructure/entities/employee.orm.entity'
import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { DATA_SOURCE_SYSCLOUD, DATABASE_SYSCLOUD } from './constants'

@Module({
	imports: [
		// * MSSQL Server
		TypeOrmModule.forRootAsync({
			name: DATA_SOURCE_SYSCLOUD,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					...configService.get<TypeOrmModuleAsyncOptions>('typeorm'),
					database: DATABASE_SYSCLOUD,
					entities: [EmployeeEntity, UserEntity]
				}
			}
		})
	]
})
export class DatabaseModule {}
