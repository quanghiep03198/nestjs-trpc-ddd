import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
		super({
			usernameField: 'email',
			passwordField: 'password'
		})
	}

	async validate(email: string, password: string): Promise<UserEntity> {
		return await this.validateUserUseCase.execute({ email, password })
	}
}
