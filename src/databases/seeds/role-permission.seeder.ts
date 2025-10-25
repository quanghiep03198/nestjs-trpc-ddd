import { Role } from '@/modules/auth/domain/constants'
import { RolePermissionEntity } from '@/modules/auth/infrastructure/entities/role-permission.entity'
import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'

export class RolePermissionSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<void> {
		const rolePermissionRepository = dataSource.getRepository(RolePermissionEntity)
		const permissionRepository = dataSource.getRepository('PermissionEntity')

		// Get all permissions
		const permissions = await permissionRepository.find()

		if (permissions.length === 0) {
			console.log('  No permissions found. Please run permission seeder first.')
			return
		}

		// Define role-permission mappings using Role enum
		const rolePermissionMap: Record<Role, string[]> = {
			// ============ ADMIN - FULL ACCESS ============
			[Role.ADMIN]: permissions.map((p) => p.code), // Admin có tất cả quyền

			// ============ HR_MANAGER - HR OPERATIONS ============
			[Role.HR_MANAGER]: [
				// Employee management
				'employee:create',
				'employee:read',
				'employee:update',
				'employee:delete',
				'employee:export',
				// Department management
				'department:create',
				'department:read',
				'department:update',
				'department:delete',
				// User management
				'user:create',
				'user:read',
				'user:update',
				'user:delete',
				// Attendance
				'attendance:read',
				'attendance:update',
				'attendance:approve',
				'attendance:export',
				// Payroll
				'payroll:create',
				'payroll:read',
				'payroll:update',
				'payroll:approve',
				'payroll:export',
				// Reports
				'report:view',
				'report:export'
			],

			// ============ EMPLOYEE - SELF SERVICE ============
			[Role.EMPLOYEE]: [
				// Own employee info
				'employee:read',
				// Own attendance
				'attendance:create',
				'attendance:read',
				// Own payroll
				'payroll:read',
				// Reports
				'report:view'
			]
		}

		// Create role-permission associations
		for (const role of Object.values(Role)) {
			const permissionCodes = rolePermissionMap[role] || []

			for (const code of permissionCodes) {
				const permission = permissions.find((p) => p.code === code)
				if (!permission) continue

				const exists = await rolePermissionRepository.exists({
					where: {
						role: role,
						permission_id: permission.id
					}
				})

				if (!exists) {
					const rolePermission = rolePermissionRepository.create({
						role: role,
						permission_id: permission.id
					})
					await rolePermissionRepository.save(rolePermission)
					console.log(`  ✓ Assigned permission ${permission.code} to role ${role}`)
				}
			}
		}

		console.log('  ✓ Role-Permission seeding completed')
	}
}
