import { Injectable } from '@nestjs/common'
import { ICommand, ofType, Saga } from '@nestjs/cqrs'
import { map, Observable } from 'rxjs'
import { UpdateEmployeeContractCommand } from '../application/commands/update-employee-contract/update-employee-contract.command'
import { EmployeeDeletedEvent } from './../domain/events/employee-deleted/employee-deleted.event'

@Injectable()
export class EmployeeSagas {
	/**
	 * Khi nhân được sự kiện EmployeeDeletedEvent (nhân viên bị xóa),
	 * tự động tạo và trả về lệnh `UpdateEmployeeContractCommand`
	 * để cập nhật trạng thái hợp đồng của nhân viên đó thành 'terminated' (kết thúc).
	 */
	@Saga()
	employeeDeleted = (event$: Observable<any>): Observable<ICommand> => {
		return event$.pipe(
			ofType(EmployeeDeletedEvent),
			map((event) => {
				return new UpdateEmployeeContractCommand({
					employee_code: event.deleteEmployeeRequest.employee_code,
					status: event.deleteEmployeeRequest.status,
					contract_end_date: new Date(),
					contract_type: event.deleteEmployeeRequest.contract_type
				})
			})
		)
	}
}
