import { IUseCaseHandler } from '@/common/interfaces/ddd'
import { ZodValidationPipe } from '@/common/pipes'
import { GetUserProfile } from '@/modules/user/application/queries/get-user-profile/get-user-profile.query'
import type { UserEntity } from '@/modules/user/infrastructure/entities'
import { ForbiddenException, Injectable, NotFoundException, UsePipes } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { omit } from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { loginDTO, LoginDTO } from '../dto/login.dto'

@Injectable()
export class ValidateUserUseCase implements IUseCaseHandler<LoginDTO, Omit<UserEntity, 'authenticate'>> {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly i18nService: I18nService
	) {}

	@UsePipes(new ZodValidationPipe(loginDTO))
	async execute(input: LoginDTO) {
		const currentLanguage = I18nContext.current()?.lang

		const user = await this.queryBus.execute<GetUserProfile, UserEntity>(new GetUserProfile(input.email))
		if (!user) throw new NotFoundException(this.i18nService.t('auth.user_not_found', { lang: currentLanguage }))
		if (!user.email_verified_at)
			throw new ForbiddenException(this.i18nService.t('auth.email_not_verified', { lang: currentLanguage }))
		if (!user.authenticate(input.password))
			throw new ForbiddenException(this.i18nService.t('auth.incorrect_password', { lang: currentLanguage }))

		return omit(user, 'authenticate')
	}
}
