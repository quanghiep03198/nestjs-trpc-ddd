import { EmployeeEntity } from '@/modules/employee/infrastructure/entities'

export class EmployeeCreatedEvent {
	constructor(public readonly createdEmployee: EmployeeEntity) {}
}
