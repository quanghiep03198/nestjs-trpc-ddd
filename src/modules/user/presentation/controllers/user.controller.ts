import { HttpMethod, RequireAuth, RequireRoles, Route } from '@/common/decorators'
import { ZodValidationPipe } from '@/common/pipes'
import { Body, Controller } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from '../../application/commands/create-user/create-user.command'
import { CreateUserDTO, createUserDTO } from '../../application/dto/create-user.dto'
import { GetUsersQuery } from '../../application/queries/get-users/get-users.query'

@Controller('users')
export class UserController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Route({ method: HttpMethod.GET })
	@RequireAuth()
	@RequireRoles()
	public async getUsers() {
		return await this.queryBus.execute(new GetUsersQuery())
	}

	@Route({ method: HttpMethod.POST })
	public async createUser(@Body(new ZodValidationPipe(createUserDTO)) createUserRequest: CreateUserDTO) {
		return await this.commandBus.execute(new CreateUserCommand(createUserRequest))
	}
}
