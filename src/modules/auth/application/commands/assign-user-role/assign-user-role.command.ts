import { ICommand } from '@nestjs/cqrs'
import { AssignUserRoleDTO } from '../../dto/assign-user-role.dto'

export class AssignUserRoleCommand implements ICommand {
	constructor(public readonly assignUserRoleRequest: AssignUserRoleDTO) {}
}
