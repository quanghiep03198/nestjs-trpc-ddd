# 📊 HRM Entity Summary

## ✅ Đã hoàn thành refactor entities

### 🔐 Authentication Module (8 entities)

| Entity                   | Purpose             | Key Fields                           | Relationships                             |
| ------------------------ | ------------------- | ------------------------------------ | ----------------------------------------- |
| **UserEntity**           | Tài khoản đăng nhập | username, email, password_hash       | 1-1 Employee, 1-N Sessions, 1-N UserRoles |
| **UserSessionEntity**    | Phiên đăng nhập     | refresh_token, device_id, expires_at | N-1 User                                  |
| **UserRoleEntity**       | Gán vai trò         | user_id, role_id, expires_at         | N-1 User, N-1 Role                        |
| **RoleEntity**           | Vai trò             | code, name, level                    | 1-N UserRoles, 1-N RolePermissions        |
| **PermissionEntity**     | Quyền hạn           | code, module, action                 | 1-N RolePermissions                       |
| **RolePermissionEntity** | Junction table      | role_id, permission_id               | N-1 Role, N-1 Permission                  |
| **UserTokenEntity**      | Reset/Verify tokens | token, type, expires_at              | N-1 User                                  |
| **UserActivityEntity**   | Audit log           | action, resource, old_data, new_data | N-1 User                                  |

### 👥 Employee Module (3 entities)

| Entity               | Purpose           | Key Fields                        | Relationships                          |
| -------------------- | ----------------- | --------------------------------- | -------------------------------------- |
| **EmployeeEntity**   | Thông tin nhân sự | employee_code, full_name, user_id | 1-1 User, N-1 Department, N-1 Position |
| **DepartmentEntity** | Phòng ban         | code, name, parent_id             | 1-N Employees, 1-N Children            |
| **PositionEntity**   | Chức vụ           | code, name, department_id, level  | 1-N Employees, N-1 Department          |

---

## 🎯 Key Changes

### ✅ Before → After

#### **UserEntity**

```diff
- Chứa cả thông tin authentication VÀ HR (full_name, phone, avatar)
+ CHỈ chứa thông tin authentication
+ Có relationship 1-1 với EmployeeEntity
```

#### **EmployeeEntity**

```diff
- Không liên kết với User
+ Có user_id (nullable) để liên kết với UserEntity
+ Không phải nhân viên nào cũng có tài khoản đăng nhập
```

#### **Role ↔ Permission**

```diff
- Relationship trực tiếp (sai)
+ Thông qua RolePermissionEntity (junction table) - đúng chuẩn many-to-many
```

---

## 📁 File Structure

```
src/modules/
├── user/infrastructure/entities/
│   ├── user.entity.ts ✅
│   ├── user-session.entity.ts ✅
│   ├── user-role.entity.ts ✅
│   ├── user-token.entity.ts ✅ (NEW)
│   ├── user-activity.entity.ts ✅ (NEW)
│   ├── role.entity.ts ✅
│   ├── permission.entity.ts ✅
│   ├── role-permission.entity.ts ✅ (NEW)
│   └── index.ts ✅
│
└── employee/infrastructure/entities/
    ├── employee.orm.entity.ts ✅
    ├── department.entity.ts ✅ (NEW)
    ├── position.entity.ts ✅ (NEW)
    └── index.ts ✅
```

---

## 🔄 Migration Path

### Step 1: Backup existing data

```sql
-- Backup users table
SELECT * INTO users_backup FROM sc_users;

-- Backup employees table
SELECT * INTO employees_backup FROM sc_employees;
```

### Step 2: Run new migrations

```bash
npm run migration:run
```

### Step 3: Seed initial data

```typescript
// 1. Seed Roles
await roleRepo.save([
	{ code: 'ADMIN', name: 'Administrator', level: 1 },
	{ code: 'HR_MANAGER', name: 'HR Manager', level: 10 },
	{ code: 'DEPT_MANAGER', name: 'Department Manager', level: 20 },
	{ code: 'EMPLOYEE', name: 'Employee', level: 100 }
])

// 2. Seed Permissions
await permissionRepo.save([
	{ code: 'employee:create', module: 'employee', action: 'create', name: 'Tạo nhân viên' },
	{ code: 'employee:read', module: 'employee', action: 'read', name: 'Xem nhân viên' },
	{ code: 'employee:update', module: 'employee', action: 'update', name: 'Sửa nhân viên' },
	{ code: 'employee:delete', module: 'employee', action: 'delete', name: 'Xóa nhân viên' }
])

// 3. Link Role-Permissions
// ADMIN has all permissions
// HR_MANAGER has employee module permissions
// etc.
```

---

## 🚀 Next Steps

### Required Updates:

1. **Update Modules**:

   ```typescript
   // user.module.ts
   TypeOrmModule.forFeature([
   	UserEntity,
   	UserSessionEntity,
   	UserRoleEntity,
   	UserTokenEntity,
   	UserActivityEntity,
   	RoleEntity,
   	PermissionEntity,
   	RolePermissionEntity
   ])
   ```

2. **Update Services**:
   - UserService: Remove HR-related methods
   - EmployeeService: Add user linking logic
   - AuthService: Update with new entity structure

3. **Update Guards**:
   - JwtGuard: Load permissions via RolePermissionEntity
   - RolesGuard: Check active roles (not expired)

4. **Create Seeders**:
   - Roles seeder
   - Permissions seeder
   - Default admin user

5. **Create Repositories**:
   - UserRepository (with helper methods)
   - EmployeeRepository
   - RoleRepository
   - PermissionRepository

---

## 📚 Documentation

See detailed architecture: `DATABASE_ARCHITECTURE.md`

---

**Status**: ✅ All entities created and validated  
**Errors**: None  
**Ready for**: Migration and seeding
