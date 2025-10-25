import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'

import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FindEmployeesQuery } from './find-employees.query'

@QueryHandler(FindEmployeesQuery)
export class FindEmployeesHandler implements IQueryHandler<FindEmployeesQuery> {
	constructor(
		@InjectRepository(EmployeeEntity, DATA_SOURCE_SYSCLOUD)
		private readonly todoRepository: Repository<EmployeeEntity>
	) {}

	async execute(query: FindEmployeesQuery): Promise<any> {
		return await this.todoRepository.findBy(query)
	}
}
