import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class RolePermission1762140230600 implements MigrationInterface {
	private readonly tableName = 'sc_role_permissions'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					...BaseAbstractEntity.BASE_COLUMNS,
					{
						name: 'role',
						type: 'nvarchar',
						isNullable: false,
						comment: 'ID vai trò'
					},
					{
						name: 'permission_id',
						type: 'int',
						isNullable: false,
						comment: 'ID quyền'
					}
				]
			}),
			true
		)

		// Create unique composite index
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_ROLE_PERMISSION_UNIQUE',
				columnNames: ['role', 'permission_id'],
				isUnique: true
			})
		)

		// Create foreign key to roles table
		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_ROLE_PERMISSION_ROLE',
				columnNames: ['role'],
				referencedTableName: 'dbo.sc_roles',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE'
			})
		)

		// Create foreign key to permissions table
		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_ROLE_PERMISSION_PERMISSION',
				columnNames: ['permission_id'],
				referencedTableName: 'dbo.sc_permissions',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE'
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop foreign keys first
		const table = await queryRunner.getTable(this.tableName)
		if (table) {
			for (const fk of table.foreignKeys) {
				await queryRunner.dropForeignKey(this.tableName, fk)
			}
			for (const idx of table.indices) {
				await queryRunner.dropIndex(this.tableName, idx)
			}
		}
		// await queryRunner.dropForeignKey(this.tableName, 'FK_ROLE_PERMISSION_ROLE')
		// await queryRunner.dropForeignKey(this.tableName, 'FK_ROLE_PERMISSION_PERMISSION')

		// Drop index
		// await queryRunner.dropIndex(this.tableName, 'IDX_ROLE_PERMISSION_UNIQUE')

		// Drop table
		await queryRunner.dropTable(this.tableName, true)
	}
}
