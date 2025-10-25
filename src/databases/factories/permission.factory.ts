import { PermissionEntity } from '@/modules/auth/infrastructure/entities/permission.entity'
import { faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(PermissionEntity, () => {
	const permission = new PermissionEntity()

	const modules = ['employee', 'department', 'user', 'role', 'attendance', 'payroll', 'report']
	const actions = ['create', 'read', 'update', 'delete', 'export', 'approve', 'assign', 'revoke', 'view']

	const module = faker.helpers.arrayElement(modules)
	const action = faker.helpers.arrayElement(actions)

	permission.module = module
	permission.action = action
	permission.code = `${module}:${action}`

	return permission
})
