import { Role } from '@/modules/auth/domain/constants'
import { RolesGuard } from '@/modules/auth/infrastructure/guards/role.guard'
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

export const ROLES_KEY = 'roles'
/**
 * @decorator
 * @description Sets the roles allowed to access a route. If no roles are provided, access is granted to any authenticated user.
 * @param allowedRoles
 * @returns
 */
export const RequireRoles = (...allowedRoles: Array<Role>) => {
	return applyDecorators(SetMetadata(ROLES_KEY, allowedRoles), UseGuards(RolesGuard))
}
