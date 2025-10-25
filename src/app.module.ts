import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { LoggerModule, Params } from 'nestjs-pino'
import path from 'node:path'
import { Languages } from './common/constants'
import { env } from './common/utils'
import { cacheConfigFactory } from './configs/cache.config'
import { loggerConfigFactory } from './configs/logger.config'
import { typeOrmConfigFactory } from './configs/typeorm.config'
import { validateConfigAsync } from './configs/validation'
import { DatabaseModule } from './databases'
import { AuthModule } from './modules/auth/auth.module'
import { DepartmentModule } from './modules/department/department.module'
import { EmployeeModule } from './modules/employee/employee.module'
import { UserModule } from './modules/user/user.module'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [
		// * Global modules
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			cache: true,
			load: [typeOrmConfigFactory, cacheConfigFactory, loggerConfigFactory],
			validate: validateConfigAsync
		}),
		I18nModule.forRoot({
			fallbackLanguage: Languages.ENGLISH,
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: env<RuntimeEnvironment>('NODE_ENV') === 'development'
			},
			typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
			resolvers: [
				{ use: QueryResolver, options: ['lng'] },
				new HeaderResolver(['X-Language']),
				AcceptLanguageResolver
			]
		}),
		// MailerModule.forRoot({}),
		CacheModule.registerAsync({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => configService.getOrThrow('cache')
		}),
		LoggerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => configService.getOrThrow<Params>('logger')
		}),
		DatabaseModule,
		RedisModule.forRoot(),

		// * Application modules
		AuthModule,
		UserModule,
		EmployeeModule,
		DepartmentModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
