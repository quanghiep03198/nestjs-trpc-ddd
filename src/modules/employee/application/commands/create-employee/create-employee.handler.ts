import { DATA_SOURCE_SYSCLOUD } from '@/databases/constants'
import { EmployeeDomainModel } from '@/modules/employee/domain/models/employee.model'
import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { ConflictException, Logger } from '@nestjs/common'
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateEmployeeCommand } from './create-employee.command'

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler implements ICommandHandler<CreateEmployeeCommand> {
	private readonly logger = new Logger(CreateEmployeeHandler.name)

	constructor(
		@InjectRepository(EmployeeEntity, DATA_SOURCE_SYSCLOUD)
		private readonly employeeRepository: Repository<EmployeeEntity>,
		private readonly publisher: EventPublisher
	) {}

	async execute({ createEmployeeRequest }: CreateEmployeeCommand): Promise<EmployeeEntity> {
		this.logger.log('Creating a new employee...')

		// * Kiểm tra email đã tồn tại hay chưa
		const existingEmployee = await this.employeeRepository.findOneBy({ email: createEmployeeRequest.email })
		if (existingEmployee) throw new ConflictException('Email đã tồn tại')

		// * Tạo mới thông tin nhân sự vào database
		const createdEmployee = this.employeeRepository.create(createEmployeeRequest)
		const savedEmployee = await this.employeeRepository.save(createdEmployee)

		console.log(JSON.stringify(savedEmployee, null, 2))

		// * Kích hoạt domain event để gửi email chúc mừng nhân viên
		const employeeDomainModel = this.publisher.mergeObjectContext(new EmployeeDomainModel())
		employeeDomainModel.dispatchEmployeeCreatedEvent(savedEmployee)
		employeeDomainModel.commit()

		return savedEmployee
	}
}
