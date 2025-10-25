import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import type { RolePermissionEntity } from './role-permission.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_permissions',
	synchronize: true
})
@Index(['code'], { unique: true })
@Index(['module'])
@Index(['action'])
export class PermissionEntity extends BaseAbstractEntity {
	@Column({ type: 'nvarchar', length: 100, unique: true, comment: 'Mã quyền (module:action) VD: employee:create' })
	code: string

	@Column({ type: 'nvarchar', length: 50, comment: 'Tên module (employee, department, attendance, payroll)' })
	module: string

	@Column({ type: 'nvarchar', length: 50, comment: 'Hành động: create, read, update, delete, approve, export' })
	action: string

	// Relationships
	@OneToMany('RolePermissionEntity', 'permissions')
	permissions: RolePermissionEntity[]
}
