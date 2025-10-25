import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import type { UserEntity } from '@/modules/user/infrastructure/entities/user.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { ContractType, EmployeeStatus, MaritalStatus } from '../../domain/constants'
import type { DepartmentEntity } from './department.entity'
import type { PositionEntity } from './position.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_employees',
	synchronize: true
})
@Index(['employee_code'], { unique: true })
@Index(['email'], { unique: true })
@Index(['phone'])
@Index(['department_id'])
@Index(['position_id'])
@Index(['user_id'], { unique: true })
@Index(['status'])
export class EmployeeEntity extends BaseAbstractEntity {
	// * ============ USER REFERENCE ============
	@Column({ type: 'int', nullable: true, unique: true, comment: 'ID tài khoản đăng nhập (nếu có)' })
	user_id?: number

	// * ============ BASIC INFO ============
	@Column({ type: 'nvarchar', length: 20, unique: true, comment: 'Mã nhân viên' })
	employee_code: string

	@Column({ type: 'nvarchar', length: 100, comment: 'Họ và tên đầy đủ' })
	full_name: string

	@Column({ type: 'date', nullable: true, comment: 'Ngày sinh' })
	date_of_birth?: Date

	@Column({ type: 'nvarchar', length: 10, nullable: true, comment: 'Giới tính: male, female, other' })
	gender?: string

	@Column({ type: 'nvarchar', length: 200, nullable: true, comment: 'Đường dẫn ảnh đại diện' })
	avatar_url?: string

	// * ============ IDENTIFICATION ============
	@Column({ type: 'nvarchar', length: 20, nullable: true, comment: 'Số CCCD/CMND' })
	identity_number?: string

	@Column({ type: 'date', nullable: true, comment: 'Ngày cấp CCCD/CMND' })
	identity_date?: Date

	@Column({ type: 'nvarchar', length: 100, nullable: true, comment: 'Nơi cấp CCCD/CMND' })
	identity_place?: string

	@Column({
		type: 'nvarchar',
		length: 20,
		nullable: true,
		enum: MaritalStatus,
		comment: 'Tình trạng hôn nhân: single, married, divorced, widowed'
	})
	marital_status?: string

	@Column({ type: 'nvarchar', length: 50, default: 'Việt Nam', comment: 'Quốc tịch' })
	nationality: string

	@Column({ type: 'nvarchar', length: 20, nullable: true, comment: 'Số bảo hiểm xã hội' })
	social_insurance_number?: string

	// * ============ CONTACT INFO ============
	@Column({ type: 'nvarchar', length: 15, nullable: true, comment: 'Số điện thoại' })
	phone?: string

	@Column({ type: 'nvarchar', length: 100, unique: true, nullable: true, comment: 'Email công ty' })
	email?: string

	@Column({ type: 'nvarchar', length: 200, nullable: true, comment: 'Địa chỉ thường trú' })
	address?: string

	// * ============ JOB INFO ============
	@Column({ type: 'int', nullable: true, comment: 'ID phòng ban' })
	department_id?: number

	@Column({ type: 'int', nullable: true, comment: 'ID chức vụ' })
	position_id?: number

	@Column({ type: 'nvarchar', length: 50, nullable: true, comment: 'Cấp bậc' })
	job_level?: string

	@Column({ type: 'date', nullable: true, comment: 'Ngày bắt đầu làm việc' })
	start_date?: Date

	// * ============ CONTRACT INFO ============
	@Column({
		type: 'nvarchar',
		length: 20,
		nullable: true,
		enum: ContractType,
		comment: 'Loại hợp đồng: indefinite_term, fixed_term, seasonal, internship, probationary, part_time'
	})
	contract_type?: ContractType

	@Column({ type: 'date', nullable: true, comment: 'Ngày kết thúc hợp đồng' })
	contract_end_date?: Date

	// * ============ EMPLOYMENT STATUS ============

	@Column({
		type: 'nvarchar',
		length: 20,
		default: 'active',
		enum: EmployeeStatus,
		comment: 'Trạng thái: active, probation, on_leave, suspended, resigned, terminated, retired, deceased'
	})
	status: string

	// * ============ RELATIONSHIPS ============
	@OneToOne('UserEntity', 'employee')
	@JoinColumn({ name: 'user_id' })
	user?: UserEntity // Will be properly typed after importing UserEntity

	@ManyToOne('DepartmentEntity', 'employees')
	@JoinColumn({ name: 'department_id' })
	department?: DepartmentEntity

	@ManyToOne('PositionEntity', 'employees')
	@JoinColumn({ name: 'position_id' })
	position?: PositionEntity

	constructor(employee: Partial<EmployeeEntity>) {
		super()
		Object.assign(this, employee)
	}
}
