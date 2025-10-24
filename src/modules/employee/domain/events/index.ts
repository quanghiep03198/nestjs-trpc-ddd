import { ContractCreatedHandler } from './employee-created/contract-created.handler'
import { EmployeeCreatedEvent } from './employee-created/employee-created.event'
import { PayrollCreatedHandler } from './employee-created/payroll-created.handler'
import { SendCongratulationEmailHandler } from './employee-created/send-congratulation-email.handler'
import { EmployeeDeletedHandler } from './employee-deleted/employee-deleted.handler'
import { EmployeeProfileUpdatedEvent } from './employee-profile-updated/employee-profile-updated.event'
import { EmployeeProfileUpdatedHandler } from './employee-profile-updated/employee-profile-updated.handler'

export type EmployeeEvents = EmployeeCreatedEvent | EmployeeProfileUpdatedEvent

export const EmployeeEventHandlers = [
	// * Handlers xử lý sự kiện sau khi tạo nhân viên
	SendCongratulationEmailHandler,
	ContractCreatedHandler,
	PayrollCreatedHandler,

	// * Handlers xử lý sự kiện sau khi cập nhật nhân viên
	EmployeeProfileUpdatedHandler,

	// * Handlers xử lý sự kiện sau khi xóa nhân viên
	EmployeeDeletedHandler
]
