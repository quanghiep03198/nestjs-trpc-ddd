import { UserEntity } from '@/modules/user/infrastructure/entities'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator(
	(property: Exclude<keyof UserEntity, 'authenticate'>, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user
		if (!user) {
			return null
		}
		return property && Object.hasOwn(user, property) ? user[property] : user
	}
)
