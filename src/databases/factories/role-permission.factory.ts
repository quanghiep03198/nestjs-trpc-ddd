import { RolePermissionEntity } from '@/modules/auth/infrastructure/entities/role-permission.entity'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(RolePermissionEntity, () => {
	const rolePermission = new RolePermissionEntity()

	// These will be set by seeder
	// rolePermission.role = Role.ADMIN (enum value)
	// rolePermission.permission_id = number

	return rolePermission
})
