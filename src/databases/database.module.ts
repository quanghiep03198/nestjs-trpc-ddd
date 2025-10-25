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
					database: DATABASE_SYSCLOUD
				}
			}
		})
	]
})
export class DatabaseModule {}
