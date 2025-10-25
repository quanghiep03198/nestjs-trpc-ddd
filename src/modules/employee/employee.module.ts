import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { Logger, Module } from '@nestjs/common'
import { CqrsModule, EventBus, UnhandledExceptionBus } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Subject, takeUntil } from 'rxjs'
import { EmployeeCommandHandlers } from './application/commands'
import { EmployeeQueryHandlers } from './application/queries'
import { EmployeeEventHandlers } from './domain/events'
import { EmployeeEntity } from './infrastructure/entities/employee.entity'
import { EmployeeEntitySubscriber } from './infrastructure/subscribers/employee.entity.subscriber'
import { EmployeeController } from './presentation/controllers/employee.controller'
import { EmployeeSagas } from './sagas/employee.saga'

@Module({
	imports: [CqrsModule, TypeOrmModule.forFeature([EmployeeEntity], DATA_SOURCE_SYSCLOUD)],
	controllers: [EmployeeController],
	providers: [
		EmployeeEntitySubscriber,
		EmployeeSagas,
		...EmployeeQueryHandlers,
		...EmployeeCommandHandlers,
		...EmployeeEventHandlers
	]
})
export class EmployeeModule {
	private readonly logger: Logger = new Logger(EmployeeModule.name)
	private destroy$ = new Subject<void>()

	constructor(
		private unhandledExceptionsBus: UnhandledExceptionBus,
		private eventBus: EventBus
	) {
		this.unhandledExceptionsBus.pipe(takeUntil(this.destroy$)).subscribe((exceptionInfo) => {
			this.logger.error('Unhandled exception in CQRS pipeline:', exceptionInfo.exception)
			// Handle exception here
			// e.g. send it to external service, terminate process, or publish a new event
		})

		this.eventBus.pipe(takeUntil(this.destroy$)).subscribe((event) => {
			this.logger.log(`Event Published: ${event.constructor.name}`)
		})
	}

	onModuleDestroy() {
		this.destroy$.next()
		this.destroy$.complete()
	}
}
