import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { UserEntity } from '@/modules/user/infrastructure/entities'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GetIsUserExistQuery } from './get-exist-user.query'

@CommandHandler(GetIsUserExistQuery)
export class GetIsUserExistHandler implements ICommandHandler<GetIsUserExistQuery, boolean> {
	constructor(
		@InjectRepository(UserEntity, DATA_SOURCE_SYSCLOUD) private readonly userRepository: Repository<UserEntity>
	) {}

	public async execute({ id }: GetIsUserExistQuery): Promise<boolean> {
		return await this.userRepository.existsBy({ id })
	}
}
