import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class Department1762141311601 implements MigrationInterface {
	private readonly tableName = 'sc_departments'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					...BaseAbstractEntity.BASE_COLUMNS,
					{
						name: 'code',
						type: 'nvarchar',
						length: '50',
						isUnique: true,
						isNullable: false,
						comment: 'Department code (unique)'
					},
					{
						name: 'name',
						type: 'nvarchar',
						length: '100',
						isNullable: false,
						comment: 'Department name'
					},
					{
						name: 'parent_id',
						type: 'int',
						isNullable: true,
						comment: 'ID of the parent department (Tree structure)'
					},
					{
						name: 'manager_id',
						type: 'int',
						isNullable: true,
						comment: 'ID of the department manager (employee ID)'
					},
					{
						name: 'phone',
						type: 'nvarchar',
						length: '15',
						isNullable: true,
						comment: 'Phone number of the department'
					},
					{
						name: 'location',
						type: 'nvarchar',
						length: '200',
						isNullable: true,
						comment: 'Location of the department'
					}
				]
			}),
			true
		)

		// Create unique index for code
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_DEPARTMENT_CODE_UNIQUE',
				columnNames: ['code'],
				isUnique: true
			})
		)

		// Create index for parent_id (for hierarchical queries)
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_DEPARTMENT_PARENT_ID',
				columnNames: ['parent_id']
			})
		)

		const employeeTable = await queryRunner.getTable('sc_employees')
		if (employeeTable)
			await queryRunner.createForeignKey(
				this.tableName,
				new TableForeignKey({
					name: 'FK_DEPARTMENT_MANAGER',
					columnNames: ['manager_id'],
					referencedTableName: employeeTable.name,
					referencedColumnNames: ['id'],
					onDelete: 'NO ACTION',
					onUpdate: 'NO ACTION'
				})
			)

		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_DEPARTMENT_PARENT',
				columnNames: ['parent_id'],
				referencedTableName: this.tableName,
				referencedColumnNames: ['id'],
				onDelete: 'NO ACTION'
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// * Drop foreign keys first using raw query
		const table = await queryRunner.getTable(this.tableName)
		if (table) {
			for (const fk of table.foreignKeys) {
				await queryRunner.dropForeignKey(this.tableName, fk)
			}
			for (const idx of table.indices) {
				await queryRunner.dropIndex(this.tableName, idx)
			}
		}

		// Drop table
		await queryRunner.dropTable(this.tableName, true)
	}
}
