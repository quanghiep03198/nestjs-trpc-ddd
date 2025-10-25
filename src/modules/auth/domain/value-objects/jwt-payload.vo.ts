import { pick } from 'lodash'
import type { UserEntity } from '../../../user/infrastructure/entities'

export class JwtPayload {
	user: Partial<UserEntity>

	constructor(user: Omit<UserEntity, 'authenticate'>) {
		this.user = user
	}

	public getPayload() {
		return pick(this.user, ['id', 'email', 'status', 'roles'])
	}
}
