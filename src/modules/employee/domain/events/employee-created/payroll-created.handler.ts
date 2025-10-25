import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { EmployeeCreatedEvent } from './employee-created.event'

@EventsHandler(EmployeeCreatedEvent)
export class PayrollCreatedHandler implements IEventHandler<EmployeeCreatedEvent> {
	async handle({ createdEmployee }: EmployeeCreatedEvent) {
		await Promise.resolve(
			setTimeout(() => {
				console.log(`Tạo bảng lương cơ bản cho nhân viên: ${createdEmployee.employee_code} `)
			}, 1000)
		)
	}
}
