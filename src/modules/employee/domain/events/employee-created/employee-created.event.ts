import { EmployeeEntity } from '@/example/infrastructure/entities/employee.orm.entity'

export class EmployeeCreatedEvent {
	constructor(public readonly createdEmployee: EmployeeEntity) {}
}
