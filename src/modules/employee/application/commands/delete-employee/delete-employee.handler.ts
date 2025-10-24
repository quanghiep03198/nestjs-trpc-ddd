import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { EmployeeDomainModel } from '@/example/domain/models/employee.model'
import { EmployeeEntity } from '@/example/infrastructure/entities/employee.orm.entity'
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { Repository } from 'typeorm'
import { DeleteEmployeeCommand } from './delete-employee.command'

@CommandHandler(DeleteEmployeeCommand)
export class DeleteEmployeeHandler implements ICommandHandler<DeleteEmployeeCommand> {
	constructor(
		@InjectRepository(EmployeeEntity, DATA_SOURCE_SYSCLOUD)
		private readonly employeeRepository: Repository<EmployeeEntity>,
		private readonly publisher: EventPublisher
	) {}

	public async execute({ deleteEmployeeRequest }: DeleteEmployeeCommand) {
		const result = await this.employeeRepository.update(
			{ employee_code: deleteEmployeeRequest.employee_code },
			omit(deleteEmployeeRequest, ['employee_code'])
		)
		const employeeDomainModel = this.publisher.mergeObjectContext(new EmployeeDomainModel())
		employeeDomainModel.dispatchEmployeeDeletedEvent(deleteEmployeeRequest)
		employeeDomainModel.commit()
		return result
	}
}
