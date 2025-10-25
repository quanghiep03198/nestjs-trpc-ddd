import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class Department1762141311601 implements MigrationInterface {
	private readonly tableName = 'sc_departments'

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Drop table if exists (cleanup from previous failed migration)
		await queryRunner.query(`
			IF OBJECT_ID('[dbo].[sc_departments]', 'U') IS NOT NULL
				DROP TABLE [dbo].[sc_departments]
		`)

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

		// Create self-referencing foreign key for parent_id using raw query
		// Note: Self-referencing FK in SQL Server has limitations:
		// - Cannot use ON DELETE CASCADE/SET NULL (causes cycles)
		// - Must use NO ACTION or handle deletion in application code
		await queryRunner.query(/* SQL */ `
			ALTER TABLE [dbo].[sc_departments]
			ADD CONSTRAINT [FK_DEPARTMENT_PARENT] 
			FOREIGN KEY ([parent_id]) 
			REFERENCES [dbo].[sc_departments]([id])
		`)

		// TODO: Create foreign key for manager_id referencing employees
		// Note: Tạm thời comment để tránh lỗi, sẽ tạo sau khi fix employee migration
		await queryRunner.query(/* SQL */ `
			ALTER TABLE [dbo].[sc_departments]
			ADD CONSTRAINT [FK_DEPARTMENT_MANAGER]
			FOREIGN KEY ([manager_id])
			REFERENCES [dbo].[sc_employees]([id])
			ON DELETE SET NULL
			ON UPDATE CASCADE
		`)
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
		// await queryRunner.query(/* SQL */ `
		// 	IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_DEPARTMENT_PARENT')
		// 		ALTER TABLE [dbo].[sc_departments] DROP CONSTRAINT [FK_DEPARTMENT_PARENT]
		// `)

		// // Drop indexes
		// // Drop indexes if they exist
		// await queryRunner.query(/* SQL */ `
		// 	IF EXISTS (SELECT name FROM sys.indexes WHERE name = 'IDX_DEPARTMENT_PARENT_ID' AND object_id = OBJECT_ID('[dbo].[sc_departments]'))
		// 		DROP INDEX [IDX_DEPARTMENT_PARENT_ID] ON [dbo].[sc_departments]
		// `)

		// await queryRunner.query(/* SQL */ `
		// 	IF EXISTS (SELECT name FROM sys.indexes WHERE name = 'IDX_DEPARTMENT_CODE_UNIQUE' AND object_id = OBJECT_ID('[dbo].[sc_departments]'))
		// 		DROP INDEX [IDX_DEPARTMENT_CODE_UNIQUE] ON [dbo].[sc_departments]
		// `)

		// Drop table
		await queryRunner.dropTable(this.tableName, true)
	}
}
