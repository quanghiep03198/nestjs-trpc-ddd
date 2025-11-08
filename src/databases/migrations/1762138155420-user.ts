import { BaseAbstractEntity } from '@/modules/_base/base.abstract.entity'
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class User1762138155420 implements MigrationInterface {
	private readonly tableName = 'sc_users'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					...BaseAbstractEntity.BASE_COLUMNS,
					{
						name: 'email',
						type: 'nvarchar',
						length: '100',
						isUnique: true,
						isNullable: false,
						comment: 'Email đăng nhập'
					},
					{
						name: 'password',
						type: 'nvarchar',
						length: '255',
						isNullable: false,
						comment: 'Mật khẩu đã hash'
					},
					{
						name: 'email_verified_at',
						type: 'datetime',
						isNullable: true,
						comment: 'Thời gian xác thực email'
					},
					{
						name: 'status',
						type: 'nvarchar',
						length: '20',
						default: "'active'",
						comment: 'Trạng thái: active, inactive, suspended, pending'
					},
					{
						name: 'last_login_at',
						type: 'datetime',
						isNullable: true,
						comment: 'Lần đăng nhập cuối'
					},
					{
						name: 'last_login_ip',
						type: 'nvarchar',
						length: '45',
						isNullable: true,
						comment: 'IP đăng nhập cuối'
					},
					{
						name: 'failed_login_attempts',
						type: 'int',
						default: 0,
						comment: 'Số lần đăng nhập thất bại liên tiếp'
					},
					{
						name: 'locked_until',
						type: 'datetime',
						isNullable: true,
						comment: 'Thời gian khóa tài khoản'
					},
					{
						name: 'force_password_change',
						type: 'bit',
						default: 0,
						comment: 'Bắt buộc đổi mật khẩu lần đăng nhập tiếp theo'
					},
					{
						name: 'password_changed_at',
						type: 'datetime',
						isNullable: true,
						comment: 'Lần thay đổi mật khẩu cuối'
					}
				]
			}),
			true
		)

		// Create indexes
		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_USER_EMAIL',
				columnNames: ['email'],
				isUnique: true
			})
		)

		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_USER_STATUS',
				columnNames: ['status']
			})
		)

		await queryRunner.createIndex(
			this.tableName,
			new TableIndex({
				name: 'IDX_USER_EMAIL_VERIFIED',
				columnNames: ['email_verified_at']
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// * Drop indexes and all foreign keys first
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

		// * Drop table
		await queryRunner.dropTable(this.tableName, true)
	}
}
