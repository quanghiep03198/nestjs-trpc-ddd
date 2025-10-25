import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'

import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EmployeeProfileUpdatedEvent } from './employee-profile-updated.event'

@EventsHandler(EmployeeProfileUpdatedEvent)
export class EmployeeProfileUpdatedHandler implements IEventHandler<EmployeeProfileUpdatedEvent> {
	private readonly logger = new Logger(EmployeeProfileUpdatedEvent.name)

	constructor(
		@InjectRepository(EmployeeEntity, DATA_SOURCE_SYSCLOUD)
		private readonly employeeRepository: Repository<EmployeeEntity>
	) {}

	async handle({ employeeCode }: EmployeeProfileUpdatedEvent) {
		const updatedEmployeeProfile = await this.employeeRepository.findOneBy({ employee_code: employeeCode })
		this.logger.log(`Employee profile updated:\n${JSON.stringify(updatedEmployeeProfile, null, 2)}`)
		this.logger.log(`Send notification email to ${updatedEmployeeProfile.email} about profile update.`)
	}
}
