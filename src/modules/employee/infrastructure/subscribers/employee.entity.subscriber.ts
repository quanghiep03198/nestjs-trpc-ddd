import { leftPad } from '@/common/libs'
import { capitalize } from 'lodash'
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { EmployeeEntity } from '../entities/employee.entity'

@EventSubscriber()
export class EmployeeEntitySubscriber implements EntitySubscriberInterface<EmployeeEntity> {
	listenTo(): Function | string {
		return EmployeeEntity
	}

	async beforeInsert(event: InsertEvent<EmployeeEntity>): Promise<void> {
		const lastPos = await event.queryRunner.manager.getRepository(EmployeeEntity).count()
		event.entity.full_name = capitalize(event.entity.full_name)
		event.entity.employee_code = 'S' + leftPad(String(lastPos + 1), 6, '0')
	}
}
