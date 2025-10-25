import { ZodValidationPipe } from '@/common/pipes'
import { Body, Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { AssignUserRoleCommand } from '../../application/commands/assign-user-role/assign-user-role.command'
import { AssignUserRoleDTO, assignUserRoleDTO } from '../../application/dto/assign-user-role.dto'

@Controller()
export class UserRoleController {
	constructor(private readonly commandBus: CommandBus) {}

	public async assignUserRole(@Body(new ZodValidationPipe(assignUserRoleDTO)) payload: AssignUserRoleDTO) {
		return await this.commandBus.execute(new AssignUserRoleCommand(payload))
	}
}
