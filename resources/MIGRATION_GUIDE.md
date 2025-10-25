# 🗄️ Database Migration Guide

## ✅ Migrations đã tạo

### 1. **1762138155420-user.ts** - Bảng sc_users
- ✅ Authentication fields: email, password
- ✅ Email verification: email_verified_at
- ✅ Login tracking: last_login_at, last_login_ip, failed_login_attempts
- ✅ Account security: locked_until, force_password_change
- ✅ Password management: password_changed_at
- ✅ Indexes: email (unique), status, email_verified_at

### 2. **1762138527416-role.ts** - Bảng sc_roles
- ✅ Role definition: code, name, description
- ✅ Hierarchy: level (1=highest)
- ✅ Assignability: is_assignable
- ✅ Indexes: code (unique), level

### 3. **1762140223320-permission.ts** - Bảng sc_permissions
- ✅ Permission structure: code (module:action)
- ✅ Module categorization: module, action
- ✅ Display info: name, description
- ✅ Indexes: code (unique), module, action

### 4. **1762140210744-user-role.ts** - Bảng sc_user_roles
- ✅ User-Role assignment: user_id, role_id
- ✅ Temporary assignment: expires_at
- ✅ Audit: assigned_by
- ✅ Foreign keys: CASCADE on delete
- ✅ Unique constraint: (user_id, role_id)

### 5. **1762140230600-role-permission.ts** - Bảng sc_role_permissions
- ✅ Role-Permission mapping: role_id, permission_id
- ✅ Foreign keys: CASCADE on delete
- ✅ Unique constraint: (role_id, permission_id)

---

## 🚀 Thứ tự chạy migrations

### Step 1: Chạy migrations theo thứ tự
```bash
# Chạy tất cả migrations
npm run migration:run

# Hoặc chạy từng migration riêng lẻ
npm run migration:run -- -t 1762138155420  # Users
npm run migration:run -- -t 1762138527416  # Roles
npm run migration:run -- -t 1762140223320  # Permissions
npm run migration:run -- -t 1762140210744  # User-Roles
npm run migration:run -- -t 1762140230600  # Role-Permissions
```

### Step 2: Verify migrations
```bash
# Check migration status
npm run migration:show

# Revert last migration if needed
npm run migration:revert
```

---

## 📊 Database Schema Diagram

```
┌─────────────────┐
│   sc_users      │
│ ─────────────── │
│ id (PK)         │
│ email           │◄──────┐
│ password        │       │
│ status          │       │
│ last_login_at   │       │
│ locked_until    │       │
└─────────────────┘       │
                          │
                          │ FK
                          │
┌─────────────────┐       │
│ sc_user_roles   │       │
│ ─────────────── │       │
│ id (PK)         │       │
│ user_id (FK)    │───────┘
│ role_id (FK)    │───────┐
│ expires_at      │       │
│ assigned_by     │       │
└─────────────────┘       │
                          │ FK
                          │
┌─────────────────┐       │
│   sc_roles      │◄──────┘
│ ─────────────── │
│ id (PK)         │◄──────┐
│ code (UQ)       │       │
│ name            │       │
│ level           │       │
│ is_assignable   │       │
└─────────────────┘       │
                          │ FK
                          │
┌─────────────────────┐   │
│ sc_role_permissions │   │
│ ─────────────────── │   │
│ id (PK)             │   │
│ role_id (FK)        │───┘
│ permission_id (FK)  │───────┐
└─────────────────────┘       │
                              │ FK
                              │
┌─────────────────┐           │
│ sc_permissions  │◄──────────┘
│ ─────────────── │
│ id (PK)         │
│ code (UQ)       │
│ module          │
│ action          │
│ name            │
└─────────────────┘
```

---

## 🌱 Seed Data

### 1. Seed Roles
```typescript
// src/databases/seeds/roles.seed.ts
const roles = [
  {
    code: 'ADMIN',
    name: 'Administrator',
    description: 'Full system access',
    level: 1,
    is_assignable: true
  },
  {
    code: 'HR_MANAGER',
    name: 'HR Manager',
    description: 'Manage employees and HR processes',
    level: 10,
    is_assignable: true
  },
  {
    code: 'DEPT_MANAGER',
    name: 'Department Manager',
    description: 'Manage department staff and operations',
    level: 20,
    is_assignable: true
  },
  {
    code: 'EMPLOYEE',
    name: 'Employee',
    description: 'Standard employee access',
    level: 100,
    is_assignable: true
  }
]
```

### 2. Seed Permissions
```typescript
// src/databases/seeds/permissions.seed.ts
const permissions = [
  // Employee module
  { code: 'employee:create', module: 'employee', action: 'create', name: 'Tạo nhân viên' },
  { code: 'employee:read', module: 'employee', action: 'read', name: 'Xem nhân viên' },
  { code: 'employee:update', module: 'employee', action: 'update', name: 'Sửa nhân viên' },
  { code: 'employee:delete', module: 'employee', action: 'delete', name: 'Xóa nhân viên' },
  { code: 'employee:export', module: 'employee', action: 'export', name: 'Export danh sách nhân viên' },
  
  // Department module
  { code: 'department:create', module: 'department', action: 'create', name: 'Tạo phòng ban' },
  { code: 'department:read', module: 'department', action: 'read', name: 'Xem phòng ban' },
  { code: 'department:update', module: 'department', action: 'update', name: 'Sửa phòng ban' },
  { code: 'department:delete', module: 'department', action: 'delete', name: 'Xóa phòng ban' },
  
  // User module
  { code: 'user:create', module: 'user', action: 'create', name: 'Tạo tài khoản' },
  { code: 'user:read', module: 'user', action: 'read', name: 'Xem tài khoản' },
  { code: 'user:update', module: 'user', action: 'update', name: 'Sửa tài khoản' },
  { code: 'user:delete', module: 'user', action: 'delete', name: 'Xóa tài khoản' },
  
  // Role management
  { code: 'role:assign', module: 'role', action: 'assign', name: 'Gán vai trò' },
  { code: 'role:revoke', module: 'role', action: 'revoke', name: 'Thu hồi vai trò' },
  
  // Attendance module
  { code: 'attendance:create', module: 'attendance', action: 'create', name: 'Chấm công' },
  { code: 'attendance:read', module: 'attendance', action: 'read', name: 'Xem chấm công' },
  { code: 'attendance:approve', module: 'attendance', action: 'approve', name: 'Duyệt chấm công' },
  
  // Payroll module
  { code: 'payroll:create', module: 'payroll', action: 'create', name: 'Tạo bảng lương' },
  { code: 'payroll:read', module: 'payroll', action: 'read', name: 'Xem bảng lương' },
  { code: 'payroll:approve', module: 'payroll', action: 'approve', name: 'Duyệt bảng lương' },
  { code: 'payroll:export', module: 'payroll', action: 'export', name: 'Export bảng lương' }
]
```

### 3. Seed Role-Permissions
```typescript
// src/databases/seeds/role-permissions.seed.ts
const rolePermissions = {
  ADMIN: ['*'], // All permissions
  
  HR_MANAGER: [
    'employee:*',
    'department:*',
    'user:create',
    'user:read',
    'user:update',
    'role:assign',
    'attendance:*',
    'payroll:*'
  ],
  
  DEPT_MANAGER: [
    'employee:read',
    'employee:update',
    'department:read',
    'attendance:read',
    'attendance:approve'
  ],
  
  EMPLOYEE: [
    'employee:read',  // Only own profile
    'attendance:create',
    'attendance:read',  // Only own records
    'payroll:read'  // Only own payroll
  ]
}
```

---

## 🔧 Troubleshooting

### Migration fails with "Table already exists"
```bash
# Drop all tables and re-run
npm run migration:revert
npm run migration:run
```

### Foreign key constraint error
```bash
# Check migration order - must run parent tables first:
# 1. users, roles, permissions
# 2. user_roles, role_permissions
```

### Cannot connect to database
```bash
# Check .env configuration
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=yourpassword
DB_DATABASE=syscloud
```

---

## 📝 Next Steps

1. ✅ Run migrations
2. ✅ Create seed files
3. ✅ Run seeders
4. ✅ Update modules to use new entities
5. ✅ Create repositories
6. ✅ Update services
7. ✅ Update guards with new permission system
8. ✅ Test authentication flow

---

**Status**: ✅ All migrations created  
**Ready for**: Database initialization  
**Next**: Run migrations and create seeders
