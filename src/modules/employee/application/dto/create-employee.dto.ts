import z from 'zod'
import { employeeDto } from '.'

// Schema cho input tạo Employee (chỉ các field cần thiết)
export const createEmployeeDto = employeeDto.omit({
	id: true,
	// * Mã nhân viên sẽ do hệ thống sinh tự động
	employee_code: true,
	// * Các trường hệ thống không cần nhập
	created_at: true,
	updated_at: true,
	created_by: true,
	updated_by: true,
	deleted_at: true,
	deleted: true,
	remark: true
})

export type CreateEmployeeDto = z.infer<typeof createEmployeeDto>
