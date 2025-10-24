import { DeleteEmployeeDto } from '../../dto/delete-employee.dto'

export class DeleteEmployeeCommand {
	constructor(public readonly deleteEmployeeRequest: DeleteEmployeeDto) {}
}
