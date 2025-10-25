import { IUseCaseHandler } from '@/common/interfaces/ddd'
import { GetUserProfile } from '@/modules/user/application/queries/get-user-profile/get-user-profile.query'
import { UserEntity } from '@/modules/user/infrastructure/entities'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import { ACCESS_TOKEN_CACHE_TTL } from '../../domain/constants'
import { JwtPayload } from '../../domain/value-objects/jwt-payload.vo'

@Injectable()
export class LoginUseCase
	implements IUseCaseHandler<Omit<UserEntity, 'authenticate'>, { user: Partial<UserEntity>; token: string }>
{
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly jwtService: JwtService,
		private readonly queryBus: QueryBus
	) {}

	async execute(payload) {
		const user = await this.queryBus.execute(new GetUserProfile(payload.email))
		const token = await this.jwtService.signAsync(new JwtPayload(user).getPayload())
		await this.cacheManager.set(`user_tokens:${payload.id}`, token, ACCESS_TOKEN_CACHE_TTL)
		return {
			user,
			token
		}
	}
}
