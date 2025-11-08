import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'
import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '../constants'

export class Employee1760158565817 implements MigrationInterface {
	private readonly table = new Table({
		database: DATABASE_SYSCLOUD,
		schema: DATABASE_SCHEMA,
		name: 'sc_employees',
		columns: [
			...BaseAbstractEntity.BASE_COLUMNS,
			// User reference (OneToOne relationship)
			{
				name: 'user_id',
				type: 'int',
				isNullable: true,
				isUnique: true,
				comment: 'ID tài khoản đăng nhập (nếu có)'
			},
			// Thông tin cơ bản
			{
				name: 'employee_code',
				type: 'nvarchar',
				length: '20',
				isUnique: true,
				comment: 'Mã nhân viên'
			},
			{
				name: 'full_name',
				type: 'nvarchar',
				length: '100',
				comment: 'Họ và tên'
			},
			{
				name: 'date_of_birth',
				type: 'date',
				isNullable: true,
				comment: 'Ngày sinh'
			},
			{
				name: 'gender',
				type: 'nvarchar',
				length: '10',
				isNullable: true,
				comment: 'Giới tính'
			},
			{
				name: 'identity_number',
				type: 'nvarchar',
				length: '20',
				isNullable: true,
				comment: 'Số CCCD/CMND'
			},
			{
				name: 'identity_date',
				type: 'date',
				isNullable: true,
				comment: 'Ngày cấp CCCD/CMND'
			},
			{
				name: 'identity_place',
				type: 'nvarchar',
				length: '100',
				isNullable: true,
				comment: 'Nơi cấp CCCD/CMND'
			},
			{
				name: 'marital_status',
				type: 'nvarchar',
				length: '10',
				isNullable: true,
				comment: 'Tình trạng hôn nhân'
			},
			{
				name: 'nationality',
				type: 'nvarchar',
				length: '50',
				isNullable: true,
				comment: 'Quốc tịch'
			},
			{
				name: 'religion',
				type: 'nvarchar',
				length: '50',
				isNullable: true,
				comment: 'Tôn giáo'
			},
			// Thông tin liên hệ
			{
				name: 'phone',
				type: 'nvarchar',
				length: '15',
				isNullable: true,
				comment: 'Số điện thoại'
			},
			{
				name: 'email',
				type: 'nvarchar',
				length: '100',
				isUnique: true,
				isNullable: true,
				comment: 'Email'
			},
			{
				name: 'address',
				type: 'nvarchar',
				length: '200',
				isNullable: true,
				comment: 'Địa chỉ thường trú'
			},
			// Thông tin công việc
			{
				name: 'department_id',
				type: 'int',
				isNullable: true,
				comment: 'ID phòng ban'
			},
			{
				name: 'position_id',
				type: 'int',
				isNullable: true,
				comment: 'ID chức vụ'
			},
			{
				name: 'job_level',
				type: 'nvarchar',
				length: '50',
				isNullable: true,
				comment: 'Cấp bậc'
			},
			{
				name: 'start_date',
				type: 'date',
				isNullable: true,
				comment: 'Ngày bắt đầu làm việc'
			},
			{
				name: 'contract_end_date',
				type: 'date',
				isNullable: true,
				comment: 'Ngày kết thúc hợp đồng'
			},
			{
				name: 'contract_type',
				type: 'nvarchar',
				length: '50',
				isNullable: true,
				comment: 'Loại hợp đồng'
			},
			{
				name: 'status',
				type: 'nvarchar',
				length: '20',
				default: "'active'",
				enum: ['active', 'probation', 'on_leave', 'suspended', 'resigned', 'terminated', 'retired', 'deceased'],
				comment: 'Trạng thái nhân viên'
			},
			// Thông tin bảo hiểm
			{
				name: 'social_insurance_number',
				type: 'nvarchar',
				length: '20',
				isNullable: true,
				comment: 'Số bảo hiểm xã hội'
			},
			{
				name: 'tax_code',
				type: 'nvarchar',
				length: '15',
				isNullable: true,
				comment: 'Mã số thuế cá nhân'
			},
			{
				name: 'avatar_url',
				type: 'nvarchar',
				length: '200',
				isNullable: true,
				comment: 'Đường dẫn ảnh đại diện'
			}
		]
	})

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(this.table, true)

		// Tạo các indices
		await queryRunner.createIndex(
			this.table,
			new TableIndex({
				name: 'IDX_sc_employees_employee_code',
				columnNames: ['employee_code'],
				isUnique: true
			})
		)

		await queryRunner.createIndex(
			this.table,
			new TableIndex({
				name: 'IDX_sc_employees_email',
				columnNames: ['email'],
				isUnique: true
			})
		)

		await queryRunner.createIndex(
			this.table,
			new TableIndex({
				name: 'IDX_sc_employees_phone',
				columnNames: ['phone']
			})
		)

		await queryRunner.createIndex(
			this.table,
			new TableIndex({
				name: 'IDX_sc_employees_department_id',
				columnNames: ['department_id']
			})
		)

		await queryRunner.createIndex(
			this.table,
			new TableIndex({
				name: 'IDX_sc_employees_position_id',
				columnNames: ['position_id']
			})
		)

		await queryRunner.createIndex(
			this.table,
			new TableIndex({
				name: 'IDX_sc_employees_status',
				columnNames: ['status']
			})
		)

		await queryRunner.createIndex(
			this.table,
			new TableIndex({
				name: 'IDX_sc_employees_user_id',
				columnNames: ['user_id'],
				isUnique: true
			})
		)

		// Add foreign keys after all tables are created
		// Note: FK to users, departments, positions will be added via raw SQL after table creation
		const [userTable, departmentTable, positionTable] = await queryRunner.getTables([
			'sc_users',
			'sc_departments',
			'sc_positions'
		])

		if (userTable)
			await queryRunner.createForeignKey(
				this.table,
				new TableForeignKey({
					name: 'FK_EMPLOYEE_USER',
					columnNames: ['user_id'],
					referencedTableName: 'sc_users',
					referencedColumnNames: ['id'],
					onDelete: 'NO ACTION',
					onUpdate: 'NO ACTION'
				})
			)
		if (departmentTable)
			await queryRunner.createForeignKey(
				this.table,
				new TableForeignKey({
					name: 'FK_EMPLOYEE_DEPARTMENT',
					columnNames: ['department_id'],
					referencedTableName: 'sc_departments',
					referencedColumnNames: ['id'],
					onDelete: 'NO ACTION',
					onUpdate: 'NO ACTION'
				})
			)
		if (positionTable)
			await queryRunner.createForeignKey(
				this.table,
				new TableForeignKey({
					name: 'FK_EMPLOYEE_POSITION',
					columnNames: ['position_id'],
					referencedTableName: 'sc_positions',
					referencedColumnNames: ['id'],
					onDelete: 'NO ACTION',
					onUpdate: 'NO ACTION'
				})
			)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// * Drop all indexes and foreign keys if exist first
		const table = await queryRunner.getTable(this.table.name)
		if (table) {
			for (const fk of table.foreignKeys) {
				await queryRunner.dropForeignKey(this.table, fk)
			}
			// Drop all indices if exist
			for (const idx of table.indices) {
				await queryRunner.dropIndex(this.table, idx)
			}
		}

		// Xóa table
		await queryRunner.dropTable(this.table, true)
	}
}
