import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import { RolePermissionEntity } from './role-permission.entity'
import { UserRoleEntity } from './user-role.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_roles',
	synchronize: true
})
@Index(['code'], { unique: true })
@Index(['level'])
export class RoleEntity extends BaseAbstractEntity {
	@Column({ type: 'nvarchar', length: 50, unique: true, comment: 'Mã vai trò (ADMIN, MANAGER, EMPLOYEE, HR)' })
	code: string

	@Column({ type: 'nvarchar', length: 100, comment: 'Tên vai trò' })
	name: string

	@Column({ type: 'text', nullable: true, comment: 'Mô tả vai trò' })
	description?: string

	@Column({ type: 'int', default: 1, comment: 'Cấp độ vai trò (1=cao nhất, 999=thấp nhất)' })
	level: number

	@Column({ type: 'bit', default: true, comment: 'Có thể gán cho user không' })
	is_assignable: boolean

	// Relationships
	@OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
	userRoles: UserRoleEntity[]

	@OneToMany(() => RolePermissionEntity, (rolePermission) => rolePermission.role)
	rolePermissions: RolePermissionEntity[]
}
