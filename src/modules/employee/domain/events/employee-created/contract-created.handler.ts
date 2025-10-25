import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { format } from 'date-fns'
import { EmployeeCreatedEvent } from './employee-created.event'

@EventsHandler(EmployeeCreatedEvent)
export class ContractCreatedHandler implements IEventHandler<EmployeeCreatedEvent> {
	async handle({ createdEmployee }: EmployeeCreatedEvent) {
		// * Tạo hợp đồng lao động cho nhân viên.
		await Promise.resolve(
			setTimeout(() => {
				console.log(
					`Tạo hợp đồng lao động cho nhân viên ${createdEmployee.full_name} (Mã nhân viên ${createdEmployee.employee_code}) thời hạn cho đến ${format(createdEmployee.contract_end_date, 'yyyy-MM-dd')}`
				)
			}, 1000)
		)
		// * Gửi hợp đồng lao động đến email của nhân viên.
		await Promise.resolve(
			setTimeout(() => {
				console.log(`Gửi hợp đồng lao động đến email: ${createdEmployee.email}`)
			}, 1000)
		)
	}
}
