import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { EmployeeCreatedEvent } from './employee-created.event'

@EventsHandler(EmployeeCreatedEvent)
export class SendCongratulationEmailHandler implements IEventHandler<EmployeeCreatedEvent> {
	async handle({ createdEmployee }: EmployeeCreatedEvent) {
		Promise.resolve(
			setTimeout(() => {
				console.log(`✅ Gửi email chúc mừng trúng tuyển đến email ${createdEmployee.email}`)
			}, 1000)
		)
	}
}
