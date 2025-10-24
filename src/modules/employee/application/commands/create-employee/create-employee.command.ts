import { CreateEmployeeDto } from '@/example/application/dto/create-employee.dto'

export class CreateEmployeeCommand {
	constructor(public readonly createEmployeeRequest: CreateEmployeeDto) {}
}
