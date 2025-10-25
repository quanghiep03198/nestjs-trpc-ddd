import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class Permission1762140223320 implements MigrationInterface {
	private readonly tableName = 'sc_permissions'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					...BaseAbstractEntity.BASE_COLUMNS,
					{
						name: 'code',
						type: 'nvarchar',
						length: '100',
						isUnique: true,
						isNullable: false,
						comment: 'Mã quyền (module:action) VD: employee:create'
					},
					{
						name: 'module',
						type: 'nvarchar',
						length: '50',
						isNullable: false,
						comment: 'Tên module (employee, department, attendance, payroll)'
					},
					{
						name: 'action',
						type: 'nvarchar',
						length: '50',
						isNullable: false,
						comment: 'Hành động: create, read, update, delete, approve, export'
					}
				]
			}),
			true
		)

		// Create indexes
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_PERMISSION_CODE',
				columnNames: ['code'],
				isUnique: true
			})
		)

		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_PERMISSION_MODULE',
				columnNames: ['module']
			})
		)

		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_PERMISSION_ACTION',
				columnNames: ['action']
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop indexes first
		await queryRunner.dropIndex(this.tableName, 'IDX_PERMISSION_ACTION')
		await queryRunner.dropIndex(this.tableName, 'IDX_PERMISSION_MODULE')
		await queryRunner.dropIndex(this.tableName, 'IDX_PERMISSION_CODE')

		// Drop table
		await queryRunner.dropTable(this.tableName, true)
	}
}
