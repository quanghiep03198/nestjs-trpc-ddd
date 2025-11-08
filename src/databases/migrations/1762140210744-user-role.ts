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
		const referenceTable = await queryRunner.getTable('sc_users')
		if (referenceTable)
			await queryRunner.createForeignKey(
				this.tableName,
				new TableForeignKey({
					name: 'FK_USER_ROLE_USER',
					columnNames: ['user_id'],
					referencedTableName: 'sc_users',
					referencedColumnNames: ['id'],
					onDelete: 'NO ACTION',
					onUpdate: 'NO ACTION'
				})
			)

		// Note: No FK for 'role' column because it's an ENUM, not a foreign key
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// * Drop foreign keys and foreign keys if exist first
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
