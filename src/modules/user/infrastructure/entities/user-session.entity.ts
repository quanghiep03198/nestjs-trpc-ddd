import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_user_sessions',
	synchronize: true
})
@Index(['user_id'])
@Index(['refresh_token'], { unique: true })
@Index(['device_id'])
@Index(['expires_at'])
@Index(['is_active'])
export class UserSessionEntity extends BaseAbstractEntity {
	@Column({ type: 'int', comment: 'ID người dùng' })
	user_id: number

	@Column({ type: 'nvarchar', length: 500, unique: true, comment: 'Refresh token' })
	refresh_token: string

	@Column({ type: 'nvarchar', length: 100, nullable: true, comment: 'Device ID' })
	device_id?: string

	@Column({ type: 'nvarchar', length: 200, nullable: true, comment: 'User agent' })
	user_agent?: string

	@Column({ type: 'nvarchar', length: 45, nullable: true, comment: 'Địa chỉ IP' })
	ip_address?: string

	@Column({ type: 'nvarchar', length: 100, nullable: true, comment: 'Vị trí địa lý' })
	location?: string

	@Column({ type: 'datetime', comment: 'Thời gian hết hạn' })
	expires_at: Date

	@Column({ type: 'datetime', nullable: true, comment: 'Lần sử dụng cuối' })
	last_used_at?: Date

	@Column({ type: 'bit', default: true, comment: 'Trạng thái hoạt động' })
	is_active: boolean

	@Column({ type: 'nvarchar', length: 50, nullable: true, comment: 'Lý do vô hiệu hóa' })
	revoked_reason?: string

	@Column({ type: 'datetime', nullable: true, comment: 'Thời gian vô hiệu hóa' })
	revoked_at?: Date

	// Relationships
	@ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity
}
