import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { DepartmentEntity } from './department.entity'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_positions',
	synchronize: true
})
@Index(['code'], { unique: true })
@Index(['department_id'])
@Index(['level'])
export class PositionEntity extends BaseAbstractEntity {
	@Column({ type: 'nvarchar', length: 50, unique: true, comment: 'Mã chức vụ' })
	code: string

	@Column({ type: 'nvarchar', length: 100, comment: 'Tên chức vụ' })
	name: string

	@Column({ type: 'text', nullable: true, comment: 'Mô tả công việc' })
	description?: string

	@Column({ type: 'int', nullable: true, comment: 'ID phòng ban' })
	department_id?: number

	@Column({ type: 'int', default: 1, comment: 'Cấp độ chức vụ (1=cao nhất)' })
	level: number

	@Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: 'Lương cơ bản tối thiểu' })
	min_salary?: number

	@Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, comment: 'Lương cơ bản tối đa' })
	max_salary?: number

	@Column({ type: 'text', nullable: true, comment: 'Yêu cầu công việc (JSON)' })
	requirements?: string

	// Relationships
	@ManyToOne(() => DepartmentEntity, (department) => department.children)
	@JoinColumn({ name: 'department_id' })
	department?: DepartmentEntity

	@OneToMany('EmployeeEntity', 'position')
	employees?: any[]
}
