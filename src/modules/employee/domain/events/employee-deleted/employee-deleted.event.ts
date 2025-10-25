import { DeleteEmployeeDto } from '@/modules/employee/application/dto/delete-employee.dto'

export class EmployeeDeletedEvent {
	constructor(public readonly deleteEmployeeRequest: DeleteEmployeeDto) {}
}
