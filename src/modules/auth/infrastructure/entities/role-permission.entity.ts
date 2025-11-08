import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Role } from '../../domain/constants'
import type { PermissionEntity } from './permission.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_role_permissions',
	synchronize: true
})
@Index(['role', 'permission_id'], { unique: true })
export class RolePermissionEntity extends BaseAbstractEntity {
	@Column({ type: 'nvarchar', enum: Role, length: 50, comment: 'ID vai trò' })
	role: Role

	@Column({ type: 'int', comment: 'ID quyền' })
	permission_id: number

	@ManyToOne('PermissionEntity', 'permissions', { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'permission_id' })
	permission: PermissionEntity
}
