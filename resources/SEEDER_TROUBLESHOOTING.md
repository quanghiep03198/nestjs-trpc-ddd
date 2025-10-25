# Seeder Loading Issues - Troubleshooting Guide

## 🐛 Vấn đề gặp phải

Seeders không được load và chạy khi dùng lệnh `npm run seed`.

---

## 🔍 Nguyên nhân

### 1. **Lỗi trong seed.ts - Factory path sai**

```typescript
// ❌ SAI
factories: [join(process.cwd(), 'src/databases/factories/**/*.seeder.{ts,js}')]
//                                                        ^^^^^^^ Sai extension!

// ✅ ĐÚNG
factories: [join(process.cwd(), 'src/databases/factories/**/*.factory.{ts,js}')]
```

**Giải thích:**

- Factory files có extension `.factory.ts` KHÔNG PHẢI `.seeder.ts`
- Glob pattern sai → không tìm thấy factories

---

### 2. **Override config không cần thiết**

```typescript
// ❌ KHÔNG TỐT - Override config
await runSeeders(dataSource, {
	seeds: [join(process.cwd(), 'src/databases/seeds/**/*.seeder.{ts,js}')],
	factories: [join(process.cwd(), 'src/databases/factories/**/*.factory.{ts,js}')]
})

// ✅ TỐT HƠN - Dùng config từ DataSource
await runSeeders(dataSource)
```

**Giải thích:**

- DataSource đã có config `seeds` và `factories` trong `data-source.ts`
- Không cần truyền lại trong `runSeeders()`
- Tránh conflict giữa 2 configs

---

### 3. **Thiếu Permission Seeder**

Thứ tự seeder phải đúng:

```
1. Permission (1762200100000) ← THIẾU FILE NÀY!
2. Role (1762200000000)
3. RolePermission (1762200200000)
```

**Vấn đề:**

- RolePermissionSeeder cần Permission data
- Nếu không có PermissionSeeder → data rỗng → không gán được permissions

---

## ✅ Giải pháp

### 1. **Fix seed.ts**

```typescript
// src/databases/seed.ts
const bootstrap = async () => {
  const logger = new Logger(...)

  try {
    logger.log('🌱 Initializing database connection...')
    await dataSource.initialize()

    logger.log('🚀 Running seeders...')
    await runSeeders(dataSource) // ← Đơn giản, không override config

    logger.log('✅ Seeders executed successfully!')
  } catch (error) {
    logger.error(error)
  } finally {
    await dataSource.destroy()
    process.exit()
  }
}
```

---

### 2. **Verify data-source.ts config**

```typescript
// src/databases/data-source.ts
export default new DataSource({
	// ... other configs

	seeds: [join(__dirname, './seeds/**/*.seeder.{ts,js}')],
	//                                    ^^^^^^^ .seeder

	factories: [join(__dirname, './factories/**/*.factory.{ts,js}')]
	//                                          ^^^^^^^^ .factory
} as DataSourceOptions & SeederOptions)
```

**Kiểm tra:**

- ✅ `seeds` path đúng: `./seeds/**/*.seeder.{ts,js}`
- ✅ `factories` path đúng: `./factories/**/*.factory.{ts,js}`
- ✅ Sử dụng `__dirname` (relative to data-source.ts)

---

### 3. **Tạo Permission Seeder**

File: `1762200100000-permission.seeder.ts`

```typescript
export default class PermissionSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<void> {
		const permissionRepository = dataSource.getRepository(PermissionEntity)

		const permissions = [
			{ code: 'employee:create', module: 'employee', action: 'create' },
			{ code: 'employee:read', module: 'employee', action: 'read' }
			// ... more permissions
		]

		for (const permissionData of permissions) {
			const exists = await permissionRepository.exists({
				where: { code: permissionData.code }
			})

			if (!exists) {
				await permissionRepository.save(permissionRepository.create(permissionData))
			}
		}
	}
}
```

---

## 🔄 Thứ tự Seeders đúng

```
Timestamp         | File                              | Dependencies
------------------|-----------------------------------|------------------
1762200000000     | role.seeder.ts                    | None
1762200100000     | permission.seeder.ts              | None
1762200200000     | role-permission.seeder.ts         | Role, Permission
1762200300000     | department.seeder.ts              | None
1762200400000     | position.seeder.ts                | Department
1762200500000     | employee.seeder.ts                | Department, Position
1762200600000     | user.seeder.ts                    | Employee
1762200700000     | user-role.seeder.ts               | User, Role
```

---

## 🧪 Testing

### 1. Kiểm tra glob pattern

```bash
# Test trong terminal
ls src/databases/seeds/*.seeder.ts
ls src/databases/factories/*.factory.ts
```

### 2. Kiểm tra seeder files

```bash
# Xem tất cả seeder files
ls -la src/databases/seeds/
```

Kết quả mong đợi:

```
1762200000000-role.seeder.ts
1762200100000-permission.seeder.ts         ← PHẢI CÓ FILE NÀY
1762200200000-role-permission.seeder.ts
1762200300000-department.seeder.ts
1762200400000-position.seeder.ts
1762200500000-employee.seeder.ts
1762200600000-user.seeder.ts
1762200700000-user-role.seeder.ts
```

### 3. Run seeders

```bash
npm run seed --host=localhost
```

Output mong đợi:

```
🌱 Initializing database connection...
🚀 Running seeders...
✅ Created role: ADMIN
✅ Created role: HR_MANAGER
...
✅ Created permission: employee:create
✅ Created permission: employee:read
...
✅ Assigned permission employee:create to role ADMIN
...
✅ Seeders executed successfully!
```

---

## 📝 Common Issues

### Issue 1: "No seeders found"

**Nguyên nhân:**

- Glob pattern sai
- Path không đúng

**Fix:**

```typescript
// ❌ Sai - dùng process.cwd()
seeds: [join(process.cwd(), 'src/databases/seeds/**/*.seeder.{ts,js}')]

// ✅ Đúng - dùng __dirname
seeds: [join(__dirname, './seeds/**/*.seeder.{ts,js}')]
```

---

### Issue 2: "Cannot find module"

**Nguyên nhân:**

- TypeScript path aliases không được resolve
- Thiếu tsconfig-paths

**Fix:**

```bash
# Đảm bảo có ts-node và tsconfig-paths
pnpm install ts-node tsconfig-paths

# Chạy với -r tsconfig-paths/register
ts-node -r tsconfig-paths/register src/databases/seed.ts
```

---

### Issue 3: "Foreign key constraint"

**Nguyên nhân:**

- Seeders chạy sai thứ tự
- Thiếu dependent data

**Fix:**

- Đặt tên file với timestamp đúng
- Chạy migrations trước: `npm run migration:run`

---

### Issue 4: Factories không được load

**Nguyên nhân:**

- Factory file extension sai
- Không export default

**Fix:**

```typescript
// ✅ Factory file phải export default
export default setSeederFactory(UserEntity, () => {
	const user = new UserEntity()
	// ...
	return user
})
```

---

## 🎯 Best Practices

### 1. **Naming Convention**

```
{timestamp}-{name}.seeder.ts   → Seeder files
{name}.factory.ts              → Factory files
{name}.entity.ts               → Entity files
```

### 2. **Seeder Structure**

```typescript
export default class MySeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<void> {
		// 1. Get repository
		const repository = dataSource.getRepository(Entity)

		// 2. Check exists
		const count = await repository.count()
		if (count > 0) {
			console.log('⏭️  Data already exists, skipping...')
			return
		}

		// 3. Seed data
		// ...

		// 4. Log success
		console.log('✅ Seeding completed!')
	}
}
```

### 3. **Error Handling**

```typescript
try {
	await dataSource.initialize()
	await runSeeders(dataSource)
} catch (error) {
	logger.error('❌ Seeding failed:', error)
	throw error // Re-throw để npm script nhận exit code
} finally {
	await dataSource.destroy()
	process.exit()
}
```

---

## 🔧 Debugging Commands

```bash
# 1. Check TypeScript compilation
npx tsc --noEmit

# 2. Test DataSource connection
ts-node -r tsconfig-paths/register -e "
import dataSource from './src/databases/data-source'
dataSource.initialize().then(() => console.log('✅ Connected'))
"

# 3. List all seeder files
ls -R src/databases/seeds/

# 4. Check glob pattern
node -e "
const glob = require('glob')
console.log(glob.sync('src/databases/seeds/**/*.seeder.ts'))
"

# 5. Run single seeder
npm run seed --host=localhost
```

---

## ✅ Final Checklist

Before running seeders:

- [ ] `data-source.ts` có đúng config seeds và factories
- [ ] `seed.ts` không override config
- [ ] Tất cả seeder files có extension `.seeder.ts`
- [ ] Tất cả factory files có extension `.factory.ts`
- [ ] Seeders có timestamp đúng thứ tự
- [ ] Permission seeder tồn tại và chạy trước role-permission
- [ ] Đã chạy migrations: `npm run migration:run`
- [ ] Database connection string đúng

Run: `npm run seed --host=localhost` 🚀

---

**Updated:** November 6, 2025
