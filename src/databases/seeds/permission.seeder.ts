import { PermissionEntity } from '@/modules/auth/infrastructure/entities/permission.entity'
import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'

export class PermissionSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<void> {
		const permissionRepository = dataSource.getRepository(PermissionEntity)

		const permissions = [
			// ============ EMPLOYEE MODULE ============
			{
				code: 'employee:create',
				module: 'employee',
				action: 'create'
			},
			{
				code: 'employee:read',
				module: 'employee',
				action: 'read'
			},
			{
				code: 'employee:update',
				module: 'employee',
				action: 'update'
			},
			{
				code: 'employee:delete',
				module: 'employee',
				action: 'delete'
			},
			{
				code: 'employee:export',
				module: 'employee',
				action: 'export'
			},

			// ============ DEPARTMENT MODULE ============
			{
				code: 'department:create',
				module: 'department',
				action: 'create'
			},
			{
				code: 'department:read',
				module: 'department',
				action: 'read'
			},
			{
				code: 'department:update',
				module: 'department',
				action: 'update'
			},
			{
				code: 'department:delete',
				module: 'department',
				action: 'delete'
			},

			// ============ USER MODULE ============
			{
				code: 'user:create',
				module: 'user',
				action: 'create'
			},
			{
				code: 'user:read',
				module: 'user',
				action: 'read'
			},
			{
				code: 'user:update',
				module: 'user',
				action: 'update'
			},
			{
				code: 'user:delete',
				module: 'user',
				action: 'delete'
			},

			// ============ ROLE MODULE ============
			{
				code: 'role:assign',
				module: 'role',
				action: 'assign'
			},
			{
				code: 'role:revoke',
				module: 'role',
				action: 'revoke'
			},
			{
				code: 'role:create',
				module: 'role',
				action: 'create'
			},
			{
				code: 'role:update',
				module: 'role',
				action: 'update'
			},

			// ============ ATTENDANCE MODULE ============
			{
				code: 'attendance:create',
				module: 'attendance',
				action: 'create'
			},
			{
				code: 'attendance:read',
				module: 'attendance',
				action: 'read'
			},
			{
				code: 'attendance:update',
				module: 'attendance',
				action: 'update'
			},
			{
				code: 'attendance:approve',
				module: 'attendance',
				action: 'approve'
			},
			{
				code: 'attendance:export',
				module: 'attendance',
				action: 'export'
			},

			// ============ PAYROLL MODULE ============
			{
				code: 'payroll:create',
				module: 'payroll',
				action: 'create'
			},
			{
				code: 'payroll:read',
				module: 'payroll',
				action: 'read'
			},
			{
				code: 'payroll:update',
				module: 'payroll',
				action: 'update'
			},
			{
				code: 'payroll:approve',
				module: 'payroll',
				action: 'approve'
			},
			{
				code: 'payroll:export',
				module: 'payroll',
				action: 'export'
			},

			// ============ REPORT MODULE ============
			{
				code: 'report:view',
				module: 'report',
				action: 'view'
			},
			{
				code: 'report:export',
				module: 'report',
				action: 'export'
			}
		]

		// Check if permissions already exist
		for (const permissionData of permissions) {
			const existingPermission = await permissionRepository.exists({
				where: { code: permissionData.code }
			})

			if (!existingPermission) {
				const permission = permissionRepository.create(permissionData)
				await permissionRepository.save(permission)
				console.log(`Created permission: ${permissionData.code}`)
			} else {
				console.log(`Permission already exists: ${permissionData.code}`)
			}
		}

		console.log('Permission seeding completed!')
	}
}
