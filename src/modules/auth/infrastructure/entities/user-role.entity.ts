import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { UserEntity } from '@/modules/user/infrastructure/entities'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Role } from '../../domain/constants'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_user_roles',
	synchronize: true
})
@Index(['user_id', 'role'], { unique: true })
@Index(['expires_at'])
export class UserRoleEntity extends BaseAbstractEntity {
	@Column({ type: 'int', comment: 'ID người dùng' })
	user_id: number

	@Column({ type: 'nvarchar', enum: Role, comment: 'Vai trò' })
	role: Role

	@Column({ type: 'datetime', nullable: true, comment: 'Thời gian hết hiệu lực' })
	expires_at?: Date

	@Column({ type: 'nvarchar', length: 100, nullable: true, comment: 'Người gán quyền' })
	assigned_by?: string

	// Relationships
	@ManyToOne('UserEntity', 'roles', { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity
}
