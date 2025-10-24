import { BaseAbstractEntity } from '@/databases/base/base.entity.abstract'
import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { Column, Entity } from 'typeorm'

@Entity({ database: DATABASE_SYSCLOUD, schema: DATABASE_SCHEMA, name: 'sc_users' })
export class UserEntity extends BaseAbstractEntity {
	@Column({
		name: 'email',
		type: 'nvarchar',
		length: 100,
		unique: true,
		comment: 'Email của nhân viên dùng để đăng nhập vào hệ thống'
	})
	email: string

	@Column({
		name: 'password',
		type: 'nvarchar',
		length: 255,
		comment: 'Password đăng nhập vào hệ thống, mặc định mật khẩu sẽ là phần tên email'
	})
	password: string
}
