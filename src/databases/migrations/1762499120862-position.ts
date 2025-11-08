import { DATABASE_SCHEMA, DATABASE_SYSCLOUD } from '@/databases/constants'
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class Position1762499120862 implements MigrationInterface {
	private readonly tableName = 'sc_positions'

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create sc_positions table
		await queryRunner.createTable(
			new Table({
				database: DATABASE_SYSCLOUD,
				schema: DATABASE_SCHEMA,
				name: 'sc_positions',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'code',
						type: 'nvarchar',
						length: '50',
						isUnique: true,
						isNullable: false,
						comment: 'Mã chức vụ'
					},
					{
						name: 'name',
						type: 'nvarchar',
						length: '100',
						isNullable: false,
						comment: 'Tên chức vụ'
					},
					{
						name: 'description',
						type: 'text',
						isNullable: true,
						comment: 'Mô tả công việc'
					},
					{
						name: 'department_id',
						type: 'int',
						isNullable: true,
						comment: 'ID phòng ban'
					},
					{
						name: 'level',
						type: 'int',
						default: 1,
						isNullable: false,
						comment: 'Cấp độ chức vụ (1=cao nhất)'
					},
					{
						name: 'min_salary',
						type: 'decimal',
						precision: 15,
						scale: 2,
						isNullable: true,
						comment: 'Lương cơ bản tối thiểu'
					},
					{
						name: 'max_salary',
						type: 'decimal',
						precision: 15,
						scale: 2,
						isNullable: true,
						comment: 'Lương cơ bản tối đa'
					},
					{
						name: 'requirements',
						type: 'text',
						isNullable: true,
						comment: 'Yêu cầu công việc (JSON)'
					},
					{
						name: 'created_at',
						type: 'datetime',
						default: 'GETDATE()',
						isNullable: false,
						comment: 'Thời gian tạo'
					},
					{
						name: 'updated_at',
						type: 'datetime',
						default: 'GETDATE()',
						isNullable: false,
						comment: 'Thời gian cập nhật'
					},
					{
						name: 'deleted_at',
						type: 'datetime',
						isNullable: true,
						comment: 'Thời gian xóa mềm'
					}
				]
			}),
			true
		)

		// Create unique index on code
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_POSITION_CODE',
				columnNames: ['code'],
				isUnique: true
			})
		)

		// Create index on department_id
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_POSITION_DEPARTMENT_ID',
				columnNames: ['department_id']
			})
		)

		// Create index on level
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_POSITION_LEVEL',
				columnNames: ['level']
			})
		)

		// Create foreign key to departments table
		const departmentTable = await queryRunner.getTable('sc_departments')
		if (departmentTable)
			await queryRunner.createForeignKey(
				this.tableName,
				new TableForeignKey({
					name: 'FK_POSITION_DEPARTMENT',
					columnNames: ['department_id'],
					referencedSchema: DATABASE_SCHEMA,
					referencedTableName: 'sc_departments',
					referencedColumnNames: ['id'],
					onDelete: 'NO ACTION',
					onUpdate: 'NO ACTION'
				})
			)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// * Drop all foreign keys and all foreign keys first
		const table = await queryRunner.getTable(this.tableName)
		if (table) {
			for (const fk of table.foreignKeys) {
				await queryRunner.dropForeignKey(this.tableName, fk)
			}
			// Drop all indexes
			for (const idx of table.indices) {
				await queryRunner.dropIndex(this.tableName, idx)
			}
		}

		// Drop table
		await queryRunner.dropTable(this.tableName, true)
	}
}
