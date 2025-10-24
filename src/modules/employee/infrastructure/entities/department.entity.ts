import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.entity.abstract'
import { Column, Entity, Index, OneToMany } from 'typeorm'

@Entity({
	database: DATABASE_SYSCLOUD,
	schema: DATABASE_SCHEMA,
	name: 'sc_departments',
	synchronize: true
})
@Index(['code'], { unique: true })
@Index(['parent_id'])
export class DepartmentEntity extends BaseAbstractEntity {
	@Column({ type: 'nvarchar', length: 50, unique: true, comment: 'Mã phòng ban' })
	code: string

	@Column({ type: 'nvarchar', length: 100, comment: 'Tên phòng ban' })
	name: string

	@Column({ type: 'text', nullable: true, comment: 'Mô tả phòng ban' })
	description?: string

	@Column({ type: 'int', nullable: true, comment: 'ID phòng ban cha (cho cấu trúc cây)' })
	parent_id?: number

	@Column({ type: 'int', nullable: true, comment: 'ID trưởng phòng' })
	manager_id?: number

	@Column({ type: 'nvarchar', length: 100, nullable: true, comment: 'Email phòng ban' })
	email?: string

	@Column({ type: 'nvarchar', length: 15, nullable: true, comment: 'Số điện thoại phòng ban' })
	phone?: string

	@Column({ type: 'nvarchar', length: 200, nullable: true, comment: 'Địa chỉ/Vị trí' })
	location?: string

	// Relationships
	@OneToMany('EmployeeEntity', 'department')
	employees?: any[]

	@OneToMany(() => DepartmentEntity, (department) => department.parent)
	children?: DepartmentEntity[]

	@OneToMany(() => DepartmentEntity, (department) => department.children)
	parent?: DepartmentEntity
}
