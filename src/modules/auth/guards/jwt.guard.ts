import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import type { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request>()
		const token = request.cookies['jwt']

		if (!token) throw new UnauthorizedException('No access token provided')

		try {
		} catch (error) {
			throw new UnauthorizedException('Invalid access token')
		}

		return true
	}
}
