import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import type { StringValue } from 'ms'
import { UserModule } from '../user/user.module'
import { AuthHandlers } from './application/commands'
import { AuthUseCases } from './application/use-cases'
import { PermissionEntity, RolePermissionEntity, UserRoleEntity } from './infrastructure/entities'
import { LocalStrategy } from './infrastructure/strategies/local.strategy'
import { AuthController } from './presentation/controllers/auth.controller'

@Module({
	imports: [
		CqrsModule,
		UserModule,
		TypeOrmModule.forFeature([UserRoleEntity, RolePermissionEntity, PermissionEntity], DATA_SOURCE_SYSCLOUD),
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>('JWT_SECRET'),
					signOptions: {
						expiresIn: configService.get<StringValue>('JWT_ACCESS_TOKEN_EXPIRES')
					}
				}
			}
		})
	],
	controllers: [AuthController],
	providers: [LocalStrategy, ...AuthUseCases, ...AuthHandlers]
})
export class AuthModule {}
