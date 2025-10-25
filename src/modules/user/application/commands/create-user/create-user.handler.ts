import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
	constructor(
		@InjectRepository(UserEntity, DATA_SOURCE_SYSCLOUD) private readonly userRepository: Repository<UserEntity>
	) {}

	async execute({ createUserRequest }: CreateUserCommand): Promise<any> {
		const existedUser = await this.userRepository.existsBy({ email: createUserRequest.email })
		if (existedUser) throw new Error('Email already existed')
		const newUser = this.userRepository.create(createUserRequest)
		return await this.userRepository.save(newUser)
	}
}
