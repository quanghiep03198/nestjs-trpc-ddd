import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_user_activities',
	synchronize: true
})
@Index(['user_id'])
@Index(['action'])
@Index(['resource'])
@Index(['created_at'])
@Index(['ip_address'])
@Index(['status'])
export class UserActivityEntity extends BaseAbstractEntity {
	@Column({ type: 'int', nullable: true, comment: 'ID người dùng' })
	user_id?: number

	@Column({
		type: 'nvarchar',
		length: 100,
		comment: 'Hành động: login, logout, create, update, delete, view, export, approve'
	})
	action: string

	@Column({
		type: 'nvarchar',
		length: 100,
		nullable: true,
		comment: 'Module/Resource (employee, department, attendance)'
	})
	resource?: string

	@Column({ type: 'int', nullable: true, comment: 'ID của resource (nếu có)' })
	resource_id?: number

	@Column({ type: 'text', nullable: true, comment: 'Dữ liệu cũ (JSON)' })
	old_data?: string

	@Column({ type: 'text', nullable: true, comment: 'Dữ liệu mới (JSON)' })
	new_data?: string

	@Column({ type: 'nvarchar', length: 45, nullable: true, comment: 'Địa chỉ IP' })
	ip_address?: string

	@Column({ type: 'text', nullable: true, comment: 'User agent' })
	user_agent?: string

	@Column({ type: 'nvarchar', length: 50, default: 'success', comment: 'Trạng thái: success, failed, error' })
	status: string

	@Column({ type: 'text', nullable: true, comment: 'Thông báo lỗi (nếu có)' })
	error_message?: string

	@Column({ type: 'int', nullable: true, comment: 'Thời gian thực hiện (ms)' })
	duration_ms?: number

	// Relationships
	@ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'user_id' })
	user?: UserEntity
}
