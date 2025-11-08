import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { UserRoleEntity } from '@/modules/auth/infrastructure/entities'
import { GetIsUserExistQuery } from '@/modules/user/application/queries/get-user-exist/get-exist-user.query'
import { NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'
import { AssignUserRoleCommand } from './assign-user-role.command'

@CommandHandler(AssignUserRoleCommand)
export class AssignUserRoleHandler implements ICommandHandler<AssignUserRoleCommand> {
	constructor(
		@InjectRepository(UserRoleEntity, DATA_SOURCE_SYSCLOUD)
		private readonly userRoleRepository: Repository<UserRoleEntity>,
		private readonly queryBus: QueryBus,
		private readonly i18nService: I18nService
	) {}

	async execute({ assignUserRoleRequest }: AssignUserRoleCommand) {
		const currentLanguage = I18nContext.current()?.lang

		const isUserExisted = await this.queryBus.execute(new GetIsUserExistQuery(assignUserRoleRequest.user_id))

		if (!isUserExisted)
			throw new NotFoundException(this.i18nService.t('auth.user_not_found', { lang: currentLanguage }))

		await this.userRoleRepository.save({
			user_id: assignUserRoleRequest.user_id,
			role_id: assignUserRoleRequest.role
		})
	}
}
