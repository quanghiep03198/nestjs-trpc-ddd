import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TRPCError } from '@trpc/server'
import { DeepPartial, Repository } from 'typeorm'
import { BaseAbastractService } from '../../../_base/base.abstract.service'
import { UserEntity } from '../../infrastructure/entities/user.entity'

@Injectable()
export class UserService extends BaseAbastractService<UserEntity> {
	constructor(
		@InjectRepository(UserEntity, DATA_SOURCE_SYSCLOUD) private readonly userRepository: Repository<UserEntity>
	) {
		super(userRepository)
	}

	public override async insertOne(payload: DeepPartial<UserEntity>): Promise<UserEntity> {
		// * Check if email exists
		const isEmailAlreadyExisted = await this.userRepository.existsBy({ email: payload.email })
		if (isEmailAlreadyExisted) throw new TRPCError({ message: 'Email đã tồn tại', code: 'CONFLICT' })
		return await super.insertOne(payload)
	}
}
