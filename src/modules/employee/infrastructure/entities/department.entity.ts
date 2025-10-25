import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import type { EmployeeEntity } from './employee.entity'

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

	@Column({ type: 'int', nullable: true, comment: 'ID phòng ban cha (cho cấu trúc cây)' })
	parent_id?: number

	@Column({ type: 'int', nullable: true, comment: 'ID trưởng phòng' })
	manager_id?: number

	@Column({ type: 'nvarchar', length: 15, nullable: true, comment: 'Số điện thoại phòng ban' })
	phone?: string

	@Column({ type: 'nvarchar', length: 200, nullable: true, comment: 'Địa chỉ/Vị trí' })
	location?: string

	// * Relationships
	@OneToMany('EmployeeEntity', 'department')
	employees?: EmployeeEntity[]

	@OneToMany(() => DepartmentEntity, (department) => department.parent)
	children?: DepartmentEntity[]

	@OneToMany(() => DepartmentEntity, (department) => department.children)
	parent?: DepartmentEntity
}
