import { env } from '@/common/utils'
import { ConfigFactory } from '@nestjs/config'
import type { Params } from 'nestjs-pino'

export const loggerConfigFactory: ConfigFactory<Record<'logger', Params>> = () => ({
	// * Logger configuration
	['logger']: {
		renameContext: 'HRM-API',
		pinoHttp: {
			name: 'HRM API',
			customLevels: {
				info: 0,
				debug: 1,
				trace: 2,
				warn: 3,
				error: 4,
				fatal: 5
			},
			useOnlyCustomLevels: true,
			transport: {
				targets: [
					{
						target: 'pino-pretty',
						level: 'info',
						options: {
							translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l'
						}
					},
					{
						target: 'pino-pretty',
						level: 'debug',
						options: {
							translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
							destination: 'logs/debug.log',
							colorize: false,
							append: true
						}
					},
					{
						target: 'pino-pretty',
						level: 'warn',
						options: {
							translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
							destination: 'logs/error.log',
							colorize: false,
							append: true
						}
					},
					{
						target: 'pino-loki',
						options: {
							host: env<string>('GRAFANA_LOKI_URL'),
							labels: { service_name: 'HRM-API' },
							batching: true,
							translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l'
						}
					}
				]
			}
		}
	}
})
