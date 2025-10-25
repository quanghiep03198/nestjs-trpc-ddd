import { BoolBitTransformer } from '@/databases/transformers/bool.transformer'
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	TableColumnOptions,
	UpdateDateColumn
} from 'typeorm'

@Entity({ synchronize: true })
export abstract class BaseAbstractEntity {
	@PrimaryGeneratedColumn({ name: 'id', type: 'int' })
	id: number

	@CreateDateColumn({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	created_at: Date

	@UpdateDateColumn({
		type: 'datetime',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	updated_at?: Date

	@DeleteDateColumn({ name: 'deleted_at' })
	deleted_at?: Date

	@Column({ type: 'bit', nullable: true, default: false, transformer: new BoolBitTransformer() })
	deleted?: boolean

	@Column({ type: 'nvarchar', length: 50, nullable: true })
	created_by?: string

	@Column({ type: 'nvarchar', length: 50, nullable: true })
	updated_by?: string

	// Thông tin khác
	@Column({ type: 'text', nullable: true, comment: 'Ghi chú' })
	remark?: string

	public static readonly BASE_COLUMNS: TableColumnOptions[] = [
		{ name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
		{ name: 'created_at', type: 'datetime', isNullable: true, default: 'CURRENT_TIMESTAMP' },
		{ name: 'updated_at', type: 'datetime', isNullable: true, onUpdate: 'CURRENT_TIMESTAMP' },
		{ name: 'deleted_at', type: 'datetime', isNullable: true },
		{ name: 'deleted', type: 'bit', isNullable: true, default: 0 },
		{ name: 'created_by', type: 'nvarchar', length: '50', isNullable: true },
		{ name: 'updated_by', type: 'nvarchar', length: '50', isNullable: true },
		{ name: 'remark', type: 'text', isNullable: true, comment: 'Ghi chú' }
	]
}
