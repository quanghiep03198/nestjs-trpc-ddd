import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service'

@Module({
	imports: [
		UserModule,
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>('JWT_SECRET'),
					signOptions: { expiresIn: 60 * 60 }
				}
			}
		})
	],
	providers: [AuthService]
})
export class AuthModule {}
