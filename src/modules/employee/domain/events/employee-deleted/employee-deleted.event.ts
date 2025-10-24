import { DeleteEmployeeDto } from '@/example/application/dto/delete-employee.dto'

export class EmployeeDeletedEvent {
	constructor(public readonly deleteEmployeeRequest: DeleteEmployeeDto) {}
}
