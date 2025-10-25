import { HttpMethod, Route } from '@/common/decorators'
import { ZodValidationPipe } from '@/common/pipes'
import { Body, Controller, Param } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateEmployeeCommand } from '../../application/commands/create-employee/create-employee.command'
import { DeleteEmployeeCommand } from '../../application/commands/delete-employee/delete-employee.command'
import { UpdateEmployeeProfileCommand } from '../../application/commands/update-employee-profile/update-employee-profile.command'
import { EmployeeDto } from '../../application/dto'
import { CreateEmployeeDto, createEmployeeDto } from '../../application/dto/create-employee.dto'
import { DeleteEmployeeDto, deleteEmployeeDto } from '../../application/dto/delete-employee.dto'
import { updateEmployeeProfileDto, UpdateEmployeeProfileDto } from '../../application/dto/update-employee-profile.dto'
import { FindEmployeesQuery } from '../../application/queries/find-employees/find-employees.query'

@Controller('employees')
export class EmployeeController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Route({
		method: HttpMethod.GET
	})
	async findAll(): Promise<EmployeeDto[]> {
		return await this.queryBus.execute<FindEmployeesQuery, EmployeeDto[]>(new FindEmployeesQuery())
	}

	@Route({
		endpoint: 'create',
		method: HttpMethod.POST
	})
	async create(@Body(new ZodValidationPipe(createEmployeeDto)) input: CreateEmployeeDto): Promise<EmployeeDto> {
		return await this.commandBus.execute(new CreateEmployeeCommand(input))
	}

	@Route({
		endpoint: 'update-profile/:employeeCode',
		method: HttpMethod.GET
	})
	async updateProfile(
		@Param('employeeCode') employeeCode: string,
		@Body(new ZodValidationPipe(updateEmployeeProfileDto)) update: UpdateEmployeeProfileDto
	) {
		return await this.commandBus.execute(new UpdateEmployeeProfileCommand({ ...update, employee_code: employeeCode }))
	}

	@Route({
		endpoint: 'delete/:employeeCode',
		method: HttpMethod.DELETE
	})
	async delete(@Body(new ZodValidationPipe(deleteEmployeeDto)) input: DeleteEmployeeDto) {
		return await this.commandBus.execute(new DeleteEmployeeCommand(input))
	}
}
