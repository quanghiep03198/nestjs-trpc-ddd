import { UserEntity } from '@/modules/user/infrastructure/entities/user.entity'
import { faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(UserEntity, () => {
	const user = new UserEntity()

	// Generate random email
	user.email = faker.internet.email({ provider: 'gmail.com' }).toLowerCase()

	// Default password: "Password@123" (hashed by entity BeforeInsert hook)
	user.password = 'Password@123'

	// Email verification
	user.email_verified_at = faker.helpers.arrayElement([
		faker.date.past({ years: 1 }), // Verified
		null // Not verified
	])

	// Account status
	user.status = faker.helpers.arrayElement(['active', 'inactive', 'pending', 'suspended'])

	// Login tracking
	user.last_login_at = faker.date.recent({ days: 30 })
	user.failed_login_attempts = faker.helpers.arrayElement([0, 0, 0, 1, 2]) // Mostly 0
	user.locked_until = null

	// Password management
	user.force_password_change = faker.helpers.arrayElement([false, false, false, true]) // Mostly false
	user.password_changed_at = faker.date.past({ years: 1 })

	return user
})
