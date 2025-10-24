import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Input, Mutation, Query, Router } from 'nestjs-trpc'
import { CreateEmployeeCommand } from '../../application/commands/create-employee/create-employee.command'

import { Logger } from '@nestjs/common'
import z from 'zod'
import { DeleteEmployeeCommand } from '../../application/commands/delete-employee/delete-employee.command'
import { UpdateEmployeeProfileCommand } from '../../application/commands/update-employee-profile/update-employee-profile.command'
import { employeeDto, EmployeeDto } from '../../application/dto'
import { createEmployeeDto, CreateEmployeeDto } from '../../application/dto/create-employee.dto'
import { DeleteEmployeeDto, deleteEmployeeDto } from '../../application/dto/delete-employee.dto'
import { UpdateEmployeeProfileDto, updateEmployeeProfileDto } from '../../application/dto/update-employee-profile.dto'
import { FindEmployeesQuery } from '../../application/queries/find-employees/find-employees.query'

@Router({ alias: 'employees' })
export class EmployeeRouter {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {}

	@Query({
		output: z.array(employeeDto)
	})
	async findAll(): Promise<EmployeeDto[]> {
		try {
			const result = await this.queryBus.execute<FindEmployeesQuery, EmployeeDto[]>(new FindEmployeesQuery())
			return await z.array(employeeDto).parseAsync(result)
		} catch (error) {
			Logger.error('Error fetching employees:', error)
			return []
		}
	}

	@Mutation({
		input: createEmployeeDto,
		output: employeeDto.partial()
	})
	async create(@Input() input: CreateEmployeeDto): Promise<EmployeeDto> {
		try {
			const createdEmployee = await this.commandBus.execute(new CreateEmployeeCommand(input))
			return await employeeDto.parseAsync(createdEmployee)
		} catch (error) {
			Logger.error(error)
		}
	}

	@Mutation({
		input: updateEmployeeProfileDto,
		output: z.any()
	})
	async updateProfile(@Input() input: UpdateEmployeeProfileDto) {
		return await this.commandBus.execute(new UpdateEmployeeProfileCommand(input))
	}

	@Mutation({
		input: deleteEmployeeDto,
		output: z.any()
	})
	async delete(@Input() input: DeleteEmployeeDto) {
		return await this.commandBus.execute(new DeleteEmployeeCommand(input))
	}
}
