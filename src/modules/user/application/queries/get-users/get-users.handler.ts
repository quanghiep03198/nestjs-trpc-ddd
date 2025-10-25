import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../../infrastructure/entities'
import { GetUsersQuery } from './get-users.query'

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
	constructor(
		@InjectRepository(UserEntity, DATA_SOURCE_SYSCLOUD) private readonly userRespository: Repository<UserEntity>
	) {}

	async execute(query: GetUsersQuery): Promise<UserEntity[]> {
		return await this.userRespository.find(query)
	}
}
