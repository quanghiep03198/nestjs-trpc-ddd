import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_user_tokens',
	synchronize: true
})
@Index(['user_id'])
@Index(['token'], { unique: true })
@Index(['type'])
@Index(['expires_at'])
export class UserTokenEntity extends BaseAbstractEntity {
	@Column({ type: 'int', comment: 'ID người dùng' })
	user_id: number

	@Column({ type: 'nvarchar', length: 255, unique: true, comment: 'Token' })
	token: string

	@Column({
		type: 'nvarchar',
		length: 50,
		comment: 'Loại token: password_reset, email_verification, phone_verification, api_key'
	})
	type: string

	@Column({ type: 'datetime', comment: 'Thời gian hết hạn' })
	expires_at: Date

	@Column({ type: 'bit', default: false, comment: 'Đã sử dụng' })
	is_used: boolean

	@Column({ type: 'datetime', nullable: true, comment: 'Thời gian sử dụng' })
	used_at?: Date

	@Column({ type: 'nvarchar', length: 45, nullable: true, comment: 'IP yêu cầu' })
	ip_address?: string

	@Column({ type: 'text', nullable: true, comment: 'User agent' })
	user_agent?: string

	// Relationships
	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity
}
