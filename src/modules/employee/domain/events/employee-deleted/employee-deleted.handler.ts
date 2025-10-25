import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { EmployeeDeletedEvent } from './employee-deleted.event'

@EventsHandler(EmployeeDeletedEvent)
export class EmployeeDeletedHandler implements IEventHandler<EmployeeDeletedEvent> {
	async handle({ deleteEmployeeRequest }: EmployeeDeletedEvent) {
		console.log(`Nhân viên có mã ${deleteEmployeeRequest.employee_code} đã bị xóa khỏi hệ thống.`)
	}
}
