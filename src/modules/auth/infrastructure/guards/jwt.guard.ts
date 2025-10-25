import { IS_PUBLIC_KEY } from '@/common/decorators'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import type { Request } from 'express'

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (isPublic) return true

		const request = context.switchToHttp().getRequest<Request>()
		const token = request.cookies['jwt']

		if (!token) throw new UnauthorizedException('No access token provided')

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('JWT_SECRET')
			})
			const cachedToken = await this.cacheManager.get(`token:${payload.id}`)

			if (!cachedToken) throw new UnauthorizedException('Access token has been revoked')

			request['user'] = payload
		} catch (error) {
			throw new UnauthorizedException('Invalid access token')
		}

		return true
	}
}
