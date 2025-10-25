import { env } from '@/common/utils'
import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigFactory } from '@nestjs/config'

export const mailerConfig: ConfigFactory<Record<'mailer', MailerOptions>> = () => ({
	['mailer']: {
		transport: {
			service: 'gmail',
			port: Number(env<string>('MAILER_PORT')),
			dnsTimeout: 60 * 1000,
			connectionTimeout: 60 * 1000,
			tls: {
				ciphers: 'SSLv3',
				rejectUnauthorized: false
			},
			auth: {
				user: env<string>('MAILER_AUTH_USER'), // generated ethereal user
				pass: env<string>('MAILER_AUTH_PASS') // generated ethereal password
			}
		},
		defaults: {
			from: `GreenLand <${env<string>('MAILER_AUTH_USER')}>`
		},
		template: {
			dir: process.cwd() + '/resources/templates/',
			// adapter: new HandlebarsAdapter(),
			options: {
				strict: true
			}
		}
	}
})
