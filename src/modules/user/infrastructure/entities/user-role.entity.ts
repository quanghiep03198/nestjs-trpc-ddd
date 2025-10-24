import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { RoleEntity } from './role.entity'
import { UserEntity } from './user.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_user_roles',
	synchronize: true
})
@Index(['user_id', 'role_id'], { unique: true })
@Index(['expires_at'])
export class UserRoleEntity extends BaseAbstractEntity {
	@Column({ type: 'int', comment: 'ID người dùng' })
	user_id: number

	@Column({ type: 'int', comment: 'ID vai trò' })
	role_id: number

	@Column({ type: 'datetime', nullable: true, comment: 'Thời gian hết hiệu lực' })
	expires_at?: Date

	@Column({ type: 'nvarchar', length: 100, nullable: true, comment: 'Người gán quyền' })
	assigned_by?: string

	// Relationships
	@ManyToOne(() => UserEntity, (user) => user.userRoles, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@ManyToOne(() => RoleEntity, (role) => role.userRoles, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'role_id' })
	role: RoleEntity
}
