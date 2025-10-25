import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { RoleEntity, UserRoleEntity } from '@/modules/auth/infrastructure/entities'
import { UserEntity } from '@/modules/user/infrastructure/entities'
import { NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'
import { AssignUserRoleCommand } from './assign-user-role.command'

@CommandHandler(AssignUserRoleCommand)
export class AssignUserRoleHandler implements ICommandHandler<AssignUserRoleCommand> {
	constructor(
		@InjectRepository(UserRoleEntity, DATA_SOURCE_SYSCLOUD)
		private readonly userRoleRepository: Repository<UserRoleEntity>,
		@InjectRepository(UserEntity, DATA_SOURCE_SYSCLOUD)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(RoleEntity, DATA_SOURCE_SYSCLOUD)
		private readonly roleRepository: Repository<RoleEntity>,
		private readonly i18nService: I18nService
	) {}

	async execute({ assignUserRoleRequest }: AssignUserRoleCommand) {
		const currentLanguage = I18nContext.current()?.lang

		const [isUserExisted, isRoleExisted] = await Promise.all([
			this.userRepository.existsBy({ id: assignUserRoleRequest.user_id }),
			this.roleRepository.existsBy({ id: assignUserRoleRequest.role })
		])
		if (!isUserExisted)
			throw new NotFoundException(this.i18nService.t('auth.user_not_found', { lang: currentLanguage }))
		if (!isRoleExisted)
			throw new NotFoundException(this.i18nService.t('auth.role_not_found', { lang: currentLanguage }))

		await this.userRoleRepository.save({
			user_id: assignUserRoleRequest.user_id,
			role_id: assignUserRoleRequest.role
		})
	}
}
