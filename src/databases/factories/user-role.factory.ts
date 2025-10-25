import { UserRoleEntity } from '@/modules/auth/infrastructure/entities/user-role.entity'
import { faker } from '@faker-js/faker'
import { addMonths } from 'date-fns'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(UserRoleEntity, () => {
	const userRole = new UserRoleEntity()

	// These will be set by seeder
	// userRole.user_id = number
	// userRole.role = Role.ADMIN | Role.HR_MANAGER | Role.EMPLOYEE

	// Expiration date (optional) - most roles are permanent
	userRole.expires_at = faker.helpers.arrayElement([
		null, // Permanent (90% chance)
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		addMonths(new Date(), faker.number.int({ min: 3, max: 24 })) // Temporary: 3-24 months (10% chance)
	])

	// Assigned by (optional)
	userRole.assigned_by = faker.helpers.arrayElement(['system', 'admin', faker.person.fullName(), null])

	return userRole
})
