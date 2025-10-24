import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TRPCError } from '@trpc/server'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/infrastructure/entities/user.entity'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity, DATA_SOURCE_SYSCLOUD) private readonly userReposoitory: Repository<UserEntity>
	) {}

	public async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.userReposoitory.findOneBy({ email: email })
		if (!user) throw new TRPCError({ message: 'Email không tồn tại', code: 'NOT_FOUND' })

		const isAuthenticated = await user.authenticate(password)
		if (!isAuthenticated) throw new TRPCError({ message: 'Mật khẩu không đúng', code: 'FORBIDDEN' })

		return user
	}
}
