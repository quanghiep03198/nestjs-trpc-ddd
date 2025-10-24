import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm'
import { UserRoleEntity } from './user-role.entity'
import { UserSessionEntity } from './user-session.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_users',
	synchronize: true
})
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
@Index(['status'])
@Index(['email_verified_at'])
export class UserEntity extends BaseAbstractEntity {
	// ============ AUTHENTICATION INFO ============
	@Column({ type: 'nvarchar', length: 50, unique: true, comment: 'Tên đăng nhập' })
	username: string

	@Column({ type: 'nvarchar', length: 100, unique: true, comment: 'Email đăng nhập' })
	email: string

	@Column({ type: 'nvarchar', length: 255, comment: 'Mật khẩu đã hash' })
	password_hash: string

	@Column({ type: 'datetime', nullable: true, comment: 'Thời gian xác thực email' })
	email_verified_at?: Date

	@Column({
		type: 'nvarchar',
		length: 20,
		default: 'active',
		comment: 'Trạng thái: active, inactive, suspended, pending'
	})
	status: string

	// ============ LOGIN TRACKING ============
	@Column({ type: 'datetime', nullable: true, comment: 'Lần đăng nhập cuối' })
	last_login_at?: Date

	@Column({ type: 'nvarchar', length: 45, nullable: true, comment: 'IP đăng nhập cuối' })
	last_login_ip?: string

	@Column({ type: 'int', default: 0, comment: 'Số lần đăng nhập thất bại liên tiếp' })
	failed_login_attempts: number

	@Column({ type: 'datetime', nullable: true, comment: 'Thời gian khóa tài khoản' })
	locked_until?: Date

	// ============ PASSWORD MANAGEMENT ============
	@Column({ type: 'bit', default: false, comment: 'Bắt buộc đổi mật khẩu lần đăng nhập tiếp theo' })
	force_password_change: boolean

	@Column({ type: 'datetime', nullable: true, comment: 'Lần thay đổi mật khẩu cuối' })
	password_changed_at?: Date

	// ============ RELATIONSHIPS ============
	@OneToMany(() => UserSessionEntity, (session) => session.user)
	sessions: UserSessionEntity[]

	@OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
	userRoles: UserRoleEntity[]

	// One-to-One relationship with Employee (if user is an employee)
	@OneToOne('EmployeeEntity', 'user')
	employee?: any // Will be properly typed when EmployeeEntity is updated
}
