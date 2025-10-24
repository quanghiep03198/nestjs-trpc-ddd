import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { cacheConfigFactory } from './configs/cache.config'
import { validateConfigAsync } from './configs/configs.validation'
import { i18nConfigFactory } from './configs/i18n.config'
import { typeOrmConfigFactory } from './configs/typeorm.config'
import { DatabaseModule } from './databases'
import { AuthModule } from './modules/auth/auth.module'
import { EmployeeModule } from './modules/employee/employee.module'
import { UserModule } from './modules/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			load: [typeOrmConfigFactory, i18nConfigFactory, cacheConfigFactory],
			validate: validateConfigAsync
		}),
		I18nModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => configService.get('i18n'),
			resolvers: [
				{ use: QueryResolver, options: ['lang'] },
				new HeaderResolver(['X-Language']),
				AcceptLanguageResolver
			]
		}),
		DatabaseModule,
		EmployeeModule,
		AuthModule,
		UserModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
