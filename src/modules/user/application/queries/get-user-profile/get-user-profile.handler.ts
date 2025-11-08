import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GetUserProfile } from './get-user-profile.query'

@QueryHandler(GetUserProfile)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfile, UserEntity> {
	constructor(
		@InjectRepository(UserEntity, DATA_SOURCE_SYSCLOUD) private readonly userRespository: Repository<UserEntity>
	) {}

	async execute({ email }: GetUserProfile) {
		return await this.userRespository.findOneBy({ email })
	}
}
