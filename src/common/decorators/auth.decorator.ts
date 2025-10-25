import { JwtGuard } from '@/modules/auth/infrastructure/guards/jwt.guard'
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
/**
 *
 * @decorator
 * @description Marks a route as public, allowing access without authentication.
 * @returns
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

/**
 * @decorator
 * @description Combines JwtGuard and Roles decorators to enforce authentication and role-based access control.
 * @param allowedRoles
 * @returns
 */
export const RequireAuth = () => applyDecorators(UseGuards(JwtGuard))
