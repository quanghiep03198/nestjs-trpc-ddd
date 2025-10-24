import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { PermissionEntity } from './permission.entity'
import { RoleEntity } from './role.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_role_permissions',
	synchronize: true
})
@Index(['role_id', 'permission_id'], { unique: true })
export class RolePermissionEntity extends BaseAbstractEntity {
	@Column({ type: 'int', comment: 'ID vai trò' })
	role_id: number

	@Column({ type: 'int', comment: 'ID quyền' })
	permission_id: number

	// Relationships
	@ManyToOne(() => RoleEntity, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'role_id' })
	role: RoleEntity

	@ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'permission_id' })
	permission: PermissionEntity
}
