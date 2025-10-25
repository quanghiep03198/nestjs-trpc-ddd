# Database Factories và Seeders

## 📋 Tổng quan

Hệ thống factories và seeders được thiết kế để tạo dữ liệu test với các relationships đúng giữa các entities.

---

## 🏭 Factories (Data Generators)

### 1. **User Factory** (`user.factory.ts`)

```typescript
setSeederFactory(UserEntity, () => {...})
```

**Tạo dữ liệu:**

- ✅ Email ngẫu nhiên
- ✅ Password mặc định: "Password@123" (auto-hashed)
- ✅ Status: active/inactive/pending/suspended
- ✅ Email verification status
- ✅ Login tracking data
- ✅ Password change tracking

**Relationship:** 1-1 với Employee (được set trong seeder)

---

### 2. **Role Factory** (`role.factory.ts`)

```typescript
setSeederFactory(RoleEntity, () => {...})
```

**Tạo dữ liệu:**

- ✅ Code: ADMIN, HR_MANAGER, DEPARTMENT_MANAGER, TEAM_LEAD, EMPLOYEE, INTERN
- ✅ Level tương ứng: 1, 10, 20, 50, 100, 200
- ✅ is_assignable flag

**Relationship:** 1-N với UserRole, 1-N với RolePermission

---

### 3. **Permission Factory** (`permission.factory.ts`)

```typescript
setSeederFactory(PermissionEntity, () => {...})
```

**Tạo dữ liệu:**

- ✅ Module: employee, department, user, role, attendance, payroll, report
- ✅ Action: create, read, update, delete, export, approve, etc
- ✅ Code: `{module}:{action}` (e.g., employee:create)

**Relationship:** 1-N với RolePermission

---

### 4. **UserRole Factory** (`user-role.factory.ts`)

```typescript
setSeederFactory(UserRoleEntity, () => {...})
```

**Tạo dữ liệu:**

- ✅ expires_at: null (permanent) hoặc 3-24 tháng
- ✅ assigned_by: system/admin/user name

**Foreign Keys:** user_id, role_id (được set trong seeder)

---

### 5. **RolePermission Factory** (`role-permission.factory.ts`)

```typescript
setSeederFactory(RolePermissionEntity, () => {...})
```

**Tạo dữ liệu:**

- Chỉ chứa foreign keys (được set trong seeder)

**Foreign Keys:** role_id, permission_id

---

### 6. **Department Factory** (`department.factory.ts`)

```typescript
setSeederFactory(DepartmentEntity, () => {...})
```

**Tạo dữ liệu:**

- ✅ Code: DEPT_XXX_XXXX
- ✅ Name: Engineering, HR, Finance, Marketing, Sales, etc
- ✅ Description, phone, location
- ✅ Hierarchical structure support (parent_id)

**Relationships:**

- Self-reference: parent/children
- 1-N với Employee
- manager_id set sau khi có employees

---

### 7. **Position Factory** (`position.factory.ts`)

```typescript
setSeederFactory(PositionEntity, () => {...})
```

**Tạo dữ liệu:**

- ✅ Code: POS_XXX_XXXX
- ✅ Name: CEO, Director, Manager, Senior, Junior, Intern
- ✅ Level: 1-100
- ✅ Salary range
- ✅ Requirements (JSON)

**Relationship:** N-1 với Department, 1-N với Employee

---

### 8. **Employee Factory** (`employee.factory.ts`)

```typescript
setSeederFactory(EmployeeEntity, () => {...})
```

**Tạo dữ liệu:**

- ✅ Employee code: EMPXXXXXX
- ✅ Personal info: name, DOB, gender, avatar
- ✅ Identification: ID number, tax code, social insurance
- ✅ Contact: phone, email, address
- ✅ Job info: start date, job level, contract type
- ✅ Status: active, probation, on_leave, etc

**Relationships:**

- 1-1 với User (optional)
- N-1 với Department
- N-1 với Position

---

## 🌱 Seeders (Data Population)

### Thứ tự chạy seeders (QUAN TRỌNG):

```
1. PermissionSeeder (1762200100000)
   ↓
2. RoleSeeder (1762200000000)
   ↓
3. RolePermissionSeeder (1762200200000) ← Tạo quan hệ Role-Permission
   ↓
4. DepartmentSeeder (1762200300000) ← Tạo departments với hierarchical structure
   ↓
5. PositionSeeder (1762200400000) ← Tạo positions cho mỗi department
   ↓
6. EmployeeSeeder (1762200500000) ← Tạo employees, gán department & position
   ↓
7. UserSeeder (1762200600000) ← Tạo users, link với 50% employees
   ↓
8. UserRoleSeeder (1762200700000) ← Gán roles cho users
```

---

## 📊 Chi tiết từng Seeder

### 1. **RolePermissionSeeder** (1762200200000)

```typescript
export default class RolePermissionSeeder
```

**Chức năng:**

- Gán permissions cho từng role
- ADMIN → tất cả permissions
- HR_MANAGER → employee, department, user, attendance, payroll management
- EMPLOYEE → chỉ read và self-service permissions

**Sử dụng Factory:** ✅ RolePermissionFactory

---

### 2. **DepartmentSeeder** (1762200300000)

```typescript
export default class DepartmentSeeder
```

**Chức năng:**

- Tạo 5 main departments: Engineering, HR, Finance, Marketing, Sales
- Tạo sub-departments với parent_id
   - Engineering → Frontend, Backend, DevOps
   - HR → Recruitment, Training

**Hierarchical Structure:**

```
Engineering (parent_id: null)
├── Frontend (parent_id: Engineering.id)
├── Backend (parent_id: Engineering.id)
└── DevOps (parent_id: Engineering.id)
```

**Sử dụng Factory:** ✅ DepartmentFactory

---

### 3. **PositionSeeder** (1762200400000)

```typescript
export default class PositionSeeder
```

**Chức năng:**

- Tạo positions cho MỖI department
- 7 levels: Director, Manager, Team Lead, Senior, Mid-Level, Junior, Intern
- Mỗi position có:
   - Salary range tương ứng level
   - Requirements (education, experience, skills)
   - Link tới department

**Ví dụ:**

```
Engineering Director (level: 5, salary: 100k-200k)
Engineering Manager (level: 10, salary: 80k-150k)
Engineering Team Lead (level: 20, salary: 60k-120k)
...
```

**Sử dụng Factory:** ✅ PositionFactory

---

### 4. **EmployeeSeeder** (1762200500000)

```typescript
export default class EmployeeSeeder
```

**Chức năng:**

- Tạo 100 employees
- Random assign department và position (từ department đó)
- Sau khi tạo xong:
   - Chọn 1 employee trong mỗi department làm manager
   - Update department.manager_id

**Logic gán Position:**

```typescript
const department = randomDepartment()
const position = randomPositionFromDepartment(department)
employee.department_id = department.id
employee.position_id = position.id
```

**Sử dụng Factory:** ✅ EmployeeFactory

---

### 5. **UserSeeder** (1762200600000)

```typescript
export default class UserSeeder
```

**Chức năng:**

- Tạo 1 admin user (không link employee):
   - Email: admin@company.com
   - Password: Admin@123456
- Tạo users cho 50% employees:
   - Email: employee's email hoặc employee{id}@company.com
   - Password: Password@123
   - Link employee.user_id = user.id

**User vs Employee:**

```
Total Employees: 100
├── With User Account: 50 (có thể login)
└── Without User: 50 (chỉ là employee record)
```

**Sử dụng Factory:** ✅ UserFactory

---

### 6. **UserRoleSeeder** (1762200700000)

```typescript
export default class UserRoleSeeder
```

**Chức năng:**

- Gán ADMIN role cho admin@company.com
- Gán roles cho employee users dựa trên job_level:
   - job_level = 'manager' | 'director' → HR_MANAGER role
   - Còn lại → EMPLOYEE role

**Logic:**

```typescript
if (employee.job_level === 'manager' || 'director') {
  → HR_MANAGER role
} else {
  → EMPLOYEE role
}
```

**Sử dụng Factory:** ✅ UserRoleFactory

---

## 🚀 Cách sử dụng

### 1. Import factories vào data-source.ts

```typescript
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

const options: DataSourceOptions & SeederOptions = {
	// ... other configs

	factories: ['src/databases/factories/**/*.ts'],
	seeds: ['src/databases/seeds/**/*.ts']
}

export const AppDataSource = new DataSource(options)
```

---

### 2. Chạy seeders

```bash
# Chạy tất cả seeders theo thứ tự
npm run seed

# Hoặc dùng typeorm-extension CLI
npx typeorm-extension seed -d src/databases/data-source.ts
```

---

### 3. Reset và seed lại

```bash
# Drop all tables và seed lại
npm run seed:refresh

# Hoặc manual
npm run migration:revert
npm run migration:run
npm run seed
```

---

## 📈 Kết quả sau khi seed

### Thống kê dữ liệu:

| Entity              | Count | Notes                          |
| ------------------- | ----- | ------------------------------ |
| **Permissions**     | 30    | 7 modules × 4-5 actions        |
| **Roles**           | 3     | ADMIN, HR_MANAGER, EMPLOYEE    |
| **RolePermissions** | ~70   | Role-permission mappings       |
| **Departments**     | 10    | 5 main + 5 sub departments     |
| **Positions**       | 70    | 10 departments × 7 levels      |
| **Employees**       | 100   | All with department & position |
| **Users**           | 51    | 1 admin + 50 employee users    |
| **UserRoles**       | 51    | Each user has 1 role           |

---

### Relationships được tạo:

```
✅ User (1-1) Employee (50 linked accounts)
✅ User (1-N) UserRole (51 users có roles)
✅ Role (1-N) UserRole (3 roles assigned)
✅ Role (1-N) RolePermission (~70 mappings)
✅ Permission (1-N) RolePermission
✅ Employee (N-1) Department (100 employees in 10 departments)
✅ Employee (N-1) Position (100 employees with positions)
✅ Department (self-ref) Parent/Children (5 sub-departments)
✅ Department.manager_id → Employee (10 managers assigned)
✅ Position (N-1) Department (70 positions across departments)
```

---

## 🔍 Query Examples

### Lấy user với roles và permissions:

```typescript
const user = await userRepository.findOne({
	where: { email: 'admin@company.com' },
	relations: ['roles', 'roles.role', 'roles.role.permissions', 'roles.role.permissions.permissions']
})
```

### Lấy employee với department và position:

```typescript
const employee = await employeeRepository.findOne({
	where: { id: 1 },
	relations: ['department', 'position', 'user']
})
```

### Lấy department với sub-departments và employees:

```typescript
const department = await departmentRepository.findOne({
	where: { code: 'DEPT_ENGINEERING' },
	relations: ['children', 'employees', 'employees.position']
})
```

---

## ⚠️ Lưu ý quan trọng

### 1. **Thứ tự chạy seeders:**

- ❌ Nếu chạy sai thứ tự → Foreign key constraint errors
- ✅ Đặt tên file với timestamp để tự động sort: `1762200X00000-name.seeder.ts`

### 2. **Factory vs Seeder:**

- **Factory**: Generate dữ liệu ngẫu nhiên (HOW to create)
- **Seeder**: Logic tạo relationships (WHAT to create)

### 3. **Idempotency:**

- Tất cả seeders check `exists()` trước khi insert
- An toàn khi chạy nhiều lần

### 4. **Foreign Keys:**

- Factories không set foreign keys trực tiếp
- Seeders responsible for creating relationships

---

## 🎯 Best Practices

### ✅ DO:

```typescript
// Trong seeder - set foreign keys
const employee = await factory.make({
	department_id: department.id, // ✅ Set FK
	position_id: position.id
})
```

### ❌ DON'T:

```typescript
// Trong factory - không hard-code FKs
employee.department_id = 1 // ❌ Hard-coded value
```

---

## 🔧 Troubleshooting

### Lỗi: Foreign key constraint

```
Solution: Chạy seeders theo đúng thứ tự (xem section "Thứ tự chạy seeders")
```

### Lỗi: Entity not found

```
Solution: Đảm bảo entities được import trong data-source.ts
```

### Lỗi: Factory not registered

```
Solution: Import factory trong data-source.ts factories array
```

---

**Happy Seeding! 🌱**
