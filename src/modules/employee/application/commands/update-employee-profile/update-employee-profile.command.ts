import { UpdateEmployeeProfileDto } from '../../dto/update-employee-profile.dto'

export class UpdateEmployeeProfileCommand {
	constructor(public readonly updateEmployeeProfileRequest: UpdateEmployeeProfileDto) {}
}
