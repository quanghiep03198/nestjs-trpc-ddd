import { IS_PUBLIC_KEY, ROLES_KEY } from '@/common/decorators'
import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { Role } from '@/modules/auth/domain/constants'
import { UserRoleEntity } from '@/modules/auth/infrastructure/entities'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { capitalize } from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly i18nService: I18nService,
		@InjectRepository(UserRoleEntity, DATA_SOURCE_SYSCLOUD)
		private readonly userRoleRepository: Repository<UserRoleEntity>
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const lang = I18nContext.current().lang

		// Check if route is public
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (isPublic) {
			return true
		}

		// Get required roles from decorator
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		// If no roles specified, allow any authenticated user
		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const user = request.user

		if (!user || !user.id) {
			throw new ForbiddenException(this.i18nService.t('common.unauthorized', { lang }))
		}

		// Get user's active roles from database
		const userRoles = await this.getUserActiveRoles(user.id)

		if (!userRoles || userRoles.length === 0) {
			throw new ForbiddenException(this.i18nService.t('auth.user_has_no_role', { lang }))
		}

		// * Extract role codes
		const userRoleCodes = userRoles.map(({ role }) => role)

		// * Check if user has any of the required roles
		const hasRole = requiredRoles.some((role) => userRoleCodes.includes(role))

		if (!hasRole) {
			throw new ForbiddenException(
				this.i18nService.t('auth.insufficient_permissions', {
					lang,
					args: { roles: requiredRoles.map((item) => `"${capitalize(item)}"`).join(', ') }
				})
			)
		}

		// Attach roles to request for later use
		request.userRoles = userRoles

		return true
	}

	/**
	 * Get user's active roles from database
	 * - Only active roles (is_active = true)
	 * - Not expired (expires_at is null or > now)
	 */
	private async getUserActiveRoles(userId: number): Promise<UserRoleEntity[]> {
		return this.userRoleRepository
			.createQueryBuilder('ur')
			.leftJoinAndSelect('ur.role', 'role')
			.where('ur.user_id = :userId', { userId })
			.andWhere('ur.is_active = :isActive', { isActive: true })
			.andWhere('(ur.expires_at IS NULL OR ur.expires_at > :now)', { now: new Date() })
			.orderBy('role.level', 'ASC') // Highest role first (lowest level number)
			.getMany()
	}
}
