import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class UserRole1762140210744 implements MigrationInterface {
	private readonly tableName = 'sc_user_roles'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					...BaseAbstractEntity.BASE_COLUMNS,
					{
						name: 'user_id',
						type: 'int',
						isNullable: false,
						comment: 'ID người dùng'
					},
					{
						name: 'role',
						type: 'nvarchar',
						length: '20',
						isNullable: false,
						comment: 'ID vai trò'
					},
					{
						name: 'expires_at',
						type: 'datetime',
						isNullable: true,
						comment: 'Thời gian hết hiệu lực'
					},
					{
						name: 'assigned_by',
						type: 'nvarchar',
						length: '100',
						isNullable: true,
						comment: 'Người gán quyền'
					}
				]
			}),
			true
		)

		// Create unique composite index
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_USER_ROLE_UNIQUE',
				columnNames: ['user_id', 'role'],
				isUnique: true
			})
		)

		// Create index for expires_at
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_USER_ROLE_EXPIRES',
				columnNames: ['expires_at']
			})
		)

		// Create foreign key to users table
		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_USER_ROLE_USER',
				columnNames: ['user_id'],
				referencedTableName: 'dbo.sc_users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE'
			})
		)

		// Create foreign key to roles table
		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_USER_ROLE_ROLE',
				columnNames: ['role'],
				referencedTableName: 'dbo.sc_roles',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE'
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop foreign keys first
		// Drop foreign keys if exist
		const table = await queryRunner.getTable(this.tableName)
		if (table) {
			for (const fk of table.foreignKeys) {
				await queryRunner.dropForeignKey(this.tableName, fk)
			}
			// Drop indexes if exist
			for (const idx of table.indices) {
				await queryRunner.dropIndex(this.tableName, idx)
			}
		}

		// Drop table
		await queryRunner.dropTable(this.tableName, true)
	}
}
