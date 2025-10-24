import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { EmployeeEntity } from '@/example/infrastructure/entities/employee.orm.entity'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateEmployeeContractCommand } from './update-employee-contract.command'

@CommandHandler(UpdateEmployeeContractCommand)
export class UpdateEmployeeContractHandler implements ICommandHandler<UpdateEmployeeContractCommand> {
	constructor(
		@InjectRepository(EmployeeEntity, DATA_SOURCE_SYSCLOUD)
		private readonly employeeRepository: Repository<EmployeeEntity>
	) {}

	public async execute({ updateEmployeeContractRequest }: UpdateEmployeeContractCommand): Promise<any> {
		const result = await this.employeeRepository.update(
			{ employee_code: updateEmployeeContractRequest.employee_code },
			{
				status: updateEmployeeContractRequest.status,
				...(updateEmployeeContractRequest.status === 'terminated' && {
					contract_end_date: new Date()
				})
			}
		)

		console.log(
			`✅ [Saga] Hợp đồng của nhân viên có mã "${updateEmployeeContractRequest.employee_code}" đã được cập nhật với trạng thái: "${updateEmployeeContractRequest.status}"`
		)

		return result
	}
}
