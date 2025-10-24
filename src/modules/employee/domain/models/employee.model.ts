import { DeleteEmployeeDto } from '@/example/application/dto/delete-employee.dto'
import { EmployeeEntity } from '@/example/infrastructure/entities/employee.orm.entity'
import { AggregateRoot } from '@nestjs/cqrs'
import { EmployeeCreatedEvent } from '../events/employee-created/employee-created.event'
import { EmployeeDeletedEvent } from '../events/employee-deleted/employee-deleted.event'
import { EmployeeProfileUpdatedEvent } from '../events/employee-profile-updated/employee-profile-updated.event'

/**
 * @description Định nghĩa các logic nghiệp vụ cho Employee. Sử dụng trong CQRS (Command Query Responsibility Segregation)
 * @see https://docs.nestjs.com/recipes/cqrs#events
 */
export class EmployeeDomainModel extends AggregateRoot {
	constructor() {
		super()
	}

	dispatchEmployeeCreatedEvent(newEmployee: EmployeeEntity) {
		this.apply(new EmployeeCreatedEvent(newEmployee))
	}

	dispatchEmployeeProfileUpdatedEvent(employeeCode: string) {
		this.apply(new EmployeeProfileUpdatedEvent(employeeCode))
	}

	dispatchEmployeeDeletedEvent(employeeCode: DeleteEmployeeDto) {
		this.apply(new EmployeeDeletedEvent(employeeCode))
	}
}
