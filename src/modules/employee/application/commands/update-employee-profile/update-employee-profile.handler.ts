import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { EmployeeDomainModel } from '@/modules/employee/domain/models/employee.model'
import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateEmployeeProfileCommand } from './update-employee-profile.command'

@CommandHandler(UpdateEmployeeProfileCommand)
export class UpdateEmployeeProfileHandler implements ICommandHandler<UpdateEmployeeProfileCommand> {
	constructor(
		@InjectRepository(EmployeeEntity, DATA_SOURCE_SYSCLOUD)
		private readonly employeeRepository: Repository<EmployeeEntity>,
		private readonly publisher: EventPublisher
	) {}

	async execute({ updateEmployeeProfileRequest }: UpdateEmployeeProfileCommand): Promise<any> {
		const updatedEmployeeProfile = await this.employeeRepository.update(
			{ employee_code: updateEmployeeProfileRequest.employee_code },
			updateEmployeeProfileRequest
		)
		const employeeDomainModel = this.publisher.mergeObjectContext(new EmployeeDomainModel())
		employeeDomainModel.dispatchEmployeeProfileUpdatedEvent(updateEmployeeProfileRequest.employee_code)
		employeeDomainModel.commit()
		return updatedEmployeeProfile
	}
}
