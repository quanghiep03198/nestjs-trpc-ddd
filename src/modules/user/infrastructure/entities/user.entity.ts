import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { UserRoleEntity } from '@/modules/auth/infrastructure/entities'
import type { EmployeeEntity } from '@/modules/employee/infrastructure/entities'
import { compare, genSaltSync, hashSync } from 'bcrypt'
import { BeforeInsert, Column, Entity, Index, OneToMany, OneToOne } from 'typeorm'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_users',
	synchronize: true
})
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['email_verified_at'])
export class UserEntity extends BaseAbstractEntity {
	// ============ AUTHENTICATION INFO ============
	@Column({ type: 'nvarchar', length: 100, unique: true, comment: 'Email đăng nhập' })
	email: string

	@Column({ type: 'nvarchar', length: 255, comment: 'Mật khẩu đã hash' })
	password: string

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

	@Column({ type: 'int', default: 0, comment: 'Số lần đăng nhập thất bại liên tiếp' })
	failed_login_attempts: number

	@Column({ type: 'datetime', nullable: true, comment: 'Thời gian khóa tài khoản' })
	locked_until?: Date

	// ============ PASSWORD MANAGEMENT ============
	@Column({ type: 'bit', default: false, comment: 'Bắt buộc đổi mật khẩu lần đăng nhập tiếp theo' })
	force_password_change: boolean

	@Column({ type: 'datetime', nullable: true, comment: 'Lần thay đổi mật khẩu cuối' })
	password_changed_at?: Date

	@OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
	roles: UserRoleEntity[]

	// One-to-One relationship with Employee (if user is an employee)
	// Using string to avoid circular dependency
	@OneToOne('EmployeeEntity', 'user')
	employee?: EmployeeEntity

	@BeforeInsert()
	setPassword() {
		const salt = genSaltSync()
		this.password = hashSync(this.password, salt)
	}

	async authenticate(password: string) {
		return await compare(password, this.password)
	}
}
