# HRM Database Architecture

## 📊 Kiến trúc Database cho hệ thống HRM

### 🎯 Nguyên tắc thiết kế:

- **Separation of Concerns**: Tách biệt Authentication (User) và HR Data (Employee)
- **Scalability**: Dễ dàng mở rộng thêm modules mới
- **Security**: Audit trail đầy đủ cho mọi thao tác
- **Flexibility**: Hỗ trợ phân quyền chi tiết, đa cấp

---

## 📁 Entity Structure

### 🔐 **Authentication Module** (`/modules/user`)

#### 1. **UserEntity** - Tài khoản đăng nhập

- **Mục đích**: Quản lý authentication, không chứa thông tin HR
- **Quan hệ**: 1-to-1 với Employee (nếu user là nhân viên)
- **Fields chính**:
   - `username`, `email`, `password_hash`
   - Login tracking: `last_login_at`, `failed_login_attempts`, `locked_until`
   - Password management: `force_password_change`, `password_changed_at`

#### 2. **UserSessionEntity** - Phiên đăng nhập

- **Mục đích**: Quản lý refresh tokens và multi-device login
- **Features**:
   - Device tracking: `device_id`, `user_agent`, `ip_address`
   - Token management: `refresh_token`, `expires_at`
   - Revocation: `is_active`, `revoked_at`, `revoked_reason`

#### 3. **RoleEntity** - Vai trò

- **Mục đích**: Định nghĩa các vai trò trong hệ thống
- **Examples**: ADMIN, HR_MANAGER, DEPARTMENT_MANAGER, EMPLOYEE
- **Fields**: `code`, `name`, `level`, `is_assignable`

#### 4. **PermissionEntity** - Quyền hạn

- **Mục đích**: Định nghĩa chi tiết các quyền
- **Format**: `module:action` (VD: `employee:create`, `payroll:approve`)
- **Actions**: create, read, update, delete, approve, export

#### 5. **RolePermissionEntity** - Junction Table

- **Mục đích**: Liên kết many-to-many giữa Role và Permission

#### 6. **UserRoleEntity** - Gán vai trò cho user

- **Mục đích**: Liên kết User với Role
- **Features**:
   - Temporary roles: `expires_at`
   - Audit: `assigned_by`

#### 7. **UserTokenEntity** - Reset Password / Email Verification

- **Types**:
   - `password_reset`: Token đặt lại mật khẩu
   - `email_verification`: Token xác thực email
   - `phone_verification`: Token xác thực SĐT
   - `api_key`: API key cho integration

#### 8. **UserActivityEntity** - Audit Log

- **Mục đích**: Ghi lại mọi hoạt động của user
- **Data**: action, resource, old_data, new_data, ip_address, status

---

### 👥 **Employee Module** (`/modules/employee`)

#### 1. **EmployeeEntity** - Thông tin nhân sự

- **Mục đích**: Chứa thông tin HR, không chứa authentication
- **Link với User**: `user_id` (nullable - nhân viên có thể không có tài khoản)
- **Sections**:
   - **Basic Info**: `employee_code`, `full_name`, `date_of_birth`, `gender`, `avatar_url`
   - **Identification**: `identity_number`, `identity_date`, `identity_place`
   - **Contact**: `phone`, `email`, `address`
   - **Job Info**: `department_id`, `position_id`, `job_level`, `start_date`
   - **Contract**: `contract_type`, `contract_end_date`
   - **Status**: `status` (active, probation, on_leave, resigned, etc.)
   - **Insurance**: `social_insurance_number`

#### 2. **DepartmentEntity** - Phòng ban

- **Features**:
   - Hierarchical structure: `parent_id` (cây phòng ban)
   - Manager: `manager_id`
   - Contact: `email`, `phone`, `location`

#### 3. **PositionEntity** - Chức vụ

- **Features**:
   - Link với Department: `department_id`
   - Salary range: `min_salary`, `max_salary`
   - Level hierarchy: `level`
   - Requirements: `requirements` (JSON)

---

## 🔗 Relationships Diagram

```
┌────────────┐           ┌────────────────┐
│ UserEntity │ 1 ────── 1│ EmployeeEntity │
└────────────┘           └────────────────┘
      │                          │
      │ 1                        │ N
      │                          │
      ▼ N                        ▼ 1
┌────────────────┐       ┌──────────────────┐
│ UserRoleEntity │       │ DepartmentEntity │
└────────────────┘       └──────────────────┘
      │                          │
      │ N                        │ 1
      │                          │
      ▼ 1                        ▼ N
┌────────────┐           ┌────────────────┐
│ RoleEntity │           │ PositionEntity │
└────────────┘           └────────────────┘
      │
      │ N
      │
      ▼ N
┌──────────────────────┐
│ RolePermissionEntity │
└──────────────────────┘
      │
      │ N
      │
      ▼ 1
┌──────────────────┐
│ PermissionEntity │
└──────────────────┘
```

---

## 🎨 Use Cases

### 1. **Tạo tài khoản cho nhân viên mới**

```typescript
// Step 1: Create User account
const user = await userRepo.save({
	username: 'john.doe',
	email: 'john.doe@company.com',
	password_hash: await hash('password'),
	status: 'active'
})

// Step 2: Create Employee record
const employee = await employeeRepo.save({
	user_id: user.id,
	employee_code: 'EMP001',
	full_name: 'John Doe',
	department_id: 1,
	position_id: 5,
	start_date: new Date()
})

// Step 3: Assign role
await userRoleRepo.save({
	user_id: user.id,
	role_id: employeeRoleId
})
```

### 2. **Nhân viên không có tài khoản đăng nhập**

```typescript
// Chỉ tạo Employee, không tạo User
const employee = await employeeRepo.save({
	user_id: null, // Không có tài khoản
	employee_code: 'EMP002',
	full_name: 'Jane Smith'
	// ... other fields
})
```

### 3. **Gán quyền tạm thời**

```typescript
// Manager đi công tác, gán quyền approve cho Deputy
await userRoleRepo.save({
	user_id: deputyId,
	role_id: managerRoleId,
	expires_at: new Date('2025-12-31'), // Hết hạn cuối năm
	assigned_by: 'manager@company.com'
})
```

### 4. **Audit trail - Track user activities**

```typescript
await userActivityRepo.save({
	user_id: userId,
	action: 'update',
	resource: 'employee',
	resource_id: employeeId,
	old_data: JSON.stringify(oldData),
	new_data: JSON.stringify(newData),
	ip_address: req.ip,
	status: 'success'
})
```

---

## 🚀 Future Enhancements

### Modules có thể thêm:

1. **Attendance Module**: Chấm công
   - `AttendanceEntity`: Check-in/out records
   - `AttendanceRuleEntity`: Quy định chấm công
   - `LeaveRequestEntity`: Đơn xin nghỉ

2. **Payroll Module**: Lương thưởng
   - `SalaryEntity`: Lương cơ bản
   - `PayrollEntity`: Bảng lương hàng tháng
   - `BonusEntity`: Thưởng

3. **Recruitment Module**: Tuyển dụng
   - `JobPostingEntity`: Tin tuyển dụng
   - `CandidateEntity`: Ứng viên
   - `InterviewEntity`: Lịch phỏng vấn

4. **Performance Module**: Đánh giá
   - `PerformanceReviewEntity`: Đánh giá định kỳ
   - `KPIEntity`: Chỉ tiêu KPI

---

## 📝 Migration Strategy

1. ✅ Run migrations in order:

   ```bash
   # Authentication tables first
   - sc_users
   - sc_roles
   - sc_permissions
   - sc_role_permissions
   - sc_user_roles
   - sc_user_sessions
   - sc_user_tokens
   - sc_user_activities

   # HR tables next
   - sc_departments
   - sc_positions
   - sc_employees
   ```

2. ✅ Seed data:

   ```bash
   # Seed roles
   ADMIN, HR_MANAGER, DEPARTMENT_MANAGER, EMPLOYEE

   # Seed permissions
   employee:create, employee:read, employee:update, employee:delete
   department:create, department:read, ...
   ```

---

## 🔒 Security Best Practices

1. **Never expose password_hash** in API responses
2. **Always hash passwords** before saving
3. **Use refresh tokens** for long-lived sessions
4. **Implement token blacklist** for logout
5. **Log all sensitive operations** in UserActivityEntity
6. **Rate limit** login attempts
7. **Implement account locking** after failed attempts
8. **Use HTTPS** for all API calls
9. **Validate permissions** on every protected endpoint
10.   **Regular audit** of UserActivityEntity

---

## 📊 Indexing Strategy

### High-priority indexes:

- `users.email` (unique, login)
- `users.username` (unique, login)
- `user_sessions.refresh_token` (unique, auth)
- `employees.employee_code` (unique, search)
- `employees.user_id` (unique, join)
- `user_activities.created_at` (range queries)
- `user_activities.action` (filtering)

### Medium-priority indexes:

- `departments.parent_id` (hierarchy)
- `positions.department_id` (filtering)
- `user_roles.expires_at` (cleanup jobs)

---

## 🎯 Performance Considerations

1. **Caching**:
   - Cache user permissions in Redis (TTL: 5-15 minutes)
   - Cache department tree structure
   - Cache active sessions

2. **Pagination**:
   - Always paginate employee lists
   - Use cursor-based pagination for large datasets

3. **Eager Loading**:
   - Load user.roles.permissions in one query for auth
   - Load employee.department.position for employee details

4. **Soft Delete**:
   - Use `deleted_at` for important records
   - Hard delete only sessions and tokens

---

**Designed for:** i-HRM System  
**Version:** 1.0  
**Last Updated:** 2025-10-24
