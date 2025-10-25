# Role Hierarchy & Permissions

## 📊 Role Structure

### Role Levels (1 = Highest, 200 = Lowest)

```
Level 1   → SUPER_ADMIN (System only, not assignable)
Level 5   → ADMIN
Level 10  → CEO
Level 15  → CTO, CFO, COO
Level 20  → DIRECTOR
Level 25  → HR_DIRECTOR, FINANCE_DIRECTOR, TECH_DIRECTOR
Level 30  → MANAGER
Level 35  → HR_MANAGER, DEPARTMENT_MANAGER, PROJECT_MANAGER, FINANCE_MANAGER
Level 45  → SENIOR_TEAM_LEAD
Level 50  → TEAM_LEAD
Level 60  → HR_SPECIALIST, PAYROLL_SPECIALIST, RECRUITMENT_SPECIALIST, TRAINING_SPECIALIST
Level 80  → SENIOR_EMPLOYEE
Level 100 → EMPLOYEE
Level 120 → JUNIOR_EMPLOYEE
Level 150 → CONTRACTOR, FREELANCER
Level 180 → TRAINEE
Level 200 → INTERN
```

---

## 🎭 Role Descriptions

### 1. **Executive Level** (Level 1-15)

#### **SUPER_ADMIN** (Level 1)

- ⚠️ **Not assignable** - System use only
- 🔑 All permissions
- 🎯 Purpose: System administration, full control

#### **ADMIN** (Level 5)

- ✅ Assignable
- 🔑 All permissions
- 🎯 Purpose: General administration

#### **CEO** (Level 10)

- ✅ Assignable
- 🔑 All permissions
- 🎯 Purpose: Chief Executive Officer

#### **CTO** (Level 15)

- ✅ Assignable
- 🔑 Permissions: Read-only + Reports
- 🎯 Purpose: Chief Technology Officer
- 📋 Focus: Technical overview, reports

#### **CFO** (Level 15)

- ✅ Assignable
- 🔑 Permissions: Finance management
- 🎯 Purpose: Chief Financial Officer
- 📋 Focus: Payroll, financial reports

#### **COO** (Level 15)

- ✅ Assignable
- 🔑 Permissions: Operations management
- 🎯 Purpose: Chief Operations Officer
- 📋 Focus: Attendance, operations, reports

---

### 2. **Director Level** (Level 20-25)

#### **DIRECTOR** (Level 20)

- ✅ Assignable
- 🔑 Permissions: Department oversight
- 🎯 Purpose: General director
- 📋 Focus: Employee management, reports

#### **HR_DIRECTOR** (Level 25)

- ✅ Assignable
- 🔑 Permissions: Full HR management
- 🎯 Purpose: Human Resources Director
- 📋 Focus: Employees, users, roles, attendance, payroll

#### **FINANCE_DIRECTOR** (Level 25)

- ✅ Assignable
- 🔑 Permissions: Financial oversight
- 🎯 Purpose: Finance Director
- 📋 Focus: Payroll, financial reports

#### **TECH_DIRECTOR** (Level 25)

- ✅ Assignable
- 🔑 Permissions: Technical oversight
- 🎯 Purpose: Technology Director
- 📋 Focus: Employee data, reports

---

### 3. **Manager Level** (Level 30-35)

#### **MANAGER** (Level 30)

- ✅ Assignable
- 🔑 Permissions: Team management
- 🎯 Purpose: General manager
- 📋 Focus: Employee management, attendance approval

#### **HR_MANAGER** (Level 35)

- ✅ Assignable
- 🔑 Permissions: HR operations
- 🎯 Purpose: Human Resources Manager
- 📋 Focus: Full HR operations, user management

#### **DEPARTMENT_MANAGER** (Level 35)

- ✅ Assignable
- 🔑 Permissions: Department operations
- 🎯 Purpose: Department Manager
- 📋 Focus: Department employees, attendance, reports

#### **PROJECT_MANAGER** (Level 35)

- ✅ Assignable
- 🔑 Permissions: Project oversight
- 🎯 Purpose: Project Manager
- 📋 Focus: Employee visibility, attendance tracking

#### **FINANCE_MANAGER** (Level 35)

- ✅ Assignable
- 🔑 Permissions: Payroll management
- 🎯 Purpose: Finance Manager
- 📋 Focus: Payroll processing, reports

---

### 4. **Team Lead Level** (Level 45-50)

#### **SENIOR_TEAM_LEAD** (Level 45)

- ✅ Assignable
- 🔑 Permissions: Extended team oversight
- 🎯 Purpose: Senior Team Lead
- 📋 Focus: Employee management, attendance, payroll visibility

#### **TEAM_LEAD** (Level 50)

- ✅ Assignable
- 🔑 Permissions: Team oversight
- 🎯 Purpose: Team Lead
- 📋 Focus: Team attendance approval, reports

---

### 5. **Specialist Level** (Level 60)

#### **HR_SPECIALIST** (Level 60)

- ✅ Assignable
- 🔑 Permissions: HR operations
- 🎯 Purpose: HR Specialist
- 📋 Focus: Employee CRUD, user management, attendance

#### **PAYROLL_SPECIALIST** (Level 60)

- ✅ Assignable
- 🔑 Permissions: Payroll operations
- 🎯 Purpose: Payroll Specialist
- 📋 Focus: Payroll processing, reports

#### **RECRUITMENT_SPECIALIST** (Level 60)

- ✅ Assignable
- 🔑 Permissions: Recruitment operations
- 🎯 Purpose: Recruitment Specialist
- 📋 Focus: Employee creation, user creation

#### **TRAINING_SPECIALIST** (Level 60)

- ✅ Assignable
- 🔑 Permissions: Training oversight
- 🎯 Purpose: Training Specialist
- 📋 Focus: Employee data, reports

---

### 6. **Employee Level** (Level 80-120)

#### **SENIOR_EMPLOYEE** (Level 80)

- ✅ Assignable
- 🔑 Permissions: Self-service + read access
- 🎯 Purpose: Senior Employee
- 📋 Focus: Own data, attendance, payroll

#### **EMPLOYEE** (Level 100)

- ✅ Assignable
- 🔑 Permissions: Self-service
- 🎯 Purpose: Regular Employee
- 📋 Focus: Own attendance, payroll, reports

#### **JUNIOR_EMPLOYEE** (Level 120)

- ✅ Assignable
- 🔑 Permissions: Basic self-service
- 🎯 Purpose: Junior Employee
- 📋 Focus: Own attendance, payroll

---

### 7. **Contract & Temporary** (Level 150-200)

#### **CONTRACTOR** (Level 150)

- ✅ Assignable
- 🔑 Permissions: Contract self-service
- 🎯 Purpose: External Contractor
- 📋 Focus: Own attendance, payroll

#### **FREELANCER** (Level 150)

- ✅ Assignable
- 🔑 Permissions: Freelance self-service
- 🎯 Purpose: Freelance Worker
- 📋 Focus: Own attendance, payroll

#### **TRAINEE** (Level 180)

- ✅ Assignable
- 🔑 Permissions: Limited self-service
- 🎯 Purpose: Trainee
- 📋 Focus: Own attendance

#### **INTERN** (Level 200)

- ✅ Assignable
- 🔑 Permissions: Minimal self-service
- 🎯 Purpose: Intern
- 📋 Focus: Own attendance only

---

## 🔐 Permission Matrix

### Employee Module

| Role               | Create | Read | Update | Delete | Export |
| ------------------ | ------ | ---- | ------ | ------ | ------ |
| SUPER_ADMIN        | ✅     | ✅   | ✅     | ✅     | ✅     |
| ADMIN              | ✅     | ✅   | ✅     | ✅     | ✅     |
| CEO                | ✅     | ✅   | ✅     | ✅     | ✅     |
| HR_DIRECTOR        | ✅     | ✅   | ✅     | ✅     | ✅     |
| HR_MANAGER         | ✅     | ✅   | ✅     | ✅     | ✅     |
| HR_SPECIALIST      | ✅     | ✅   | ✅     | ❌     | ✅     |
| DEPARTMENT_MANAGER | ❌     | ✅   | ✅     | ❌     | ✅     |
| MANAGER            | ❌     | ✅   | ✅     | ❌     | ✅     |
| EMPLOYEE           | ❌     | ✅   | ❌     | ❌     | ❌     |

---

### Department Module

| Role               | Create | Read | Update | Delete |
| ------------------ | ------ | ---- | ------ | ------ |
| SUPER_ADMIN        | ✅     | ✅   | ✅     | ✅     |
| ADMIN              | ✅     | ✅   | ✅     | ✅     |
| CEO                | ✅     | ✅   | ✅     | ✅     |
| HR_DIRECTOR        | ✅     | ✅   | ✅     | ✅     |
| HR_MANAGER         | ✅     | ✅   | ✅     | ✅     |
| DEPARTMENT_MANAGER | ❌     | ✅   | ✅     | ❌     |
| Others             | ❌     | ✅   | ❌     | ❌     |

---

### User Module

| Role                   | Create | Read | Update | Delete |
| ---------------------- | ------ | ---- | ------ | ------ |
| SUPER_ADMIN            | ✅     | ✅   | ✅     | ✅     |
| ADMIN                  | ✅     | ✅   | ✅     | ✅     |
| CEO                    | ✅     | ✅   | ✅     | ✅     |
| HR_DIRECTOR            | ✅     | ✅   | ✅     | ✅     |
| HR_MANAGER             | ✅     | ✅   | ✅     | ✅     |
| HR_SPECIALIST          | ✅     | ✅   | ✅     | ❌     |
| RECRUITMENT_SPECIALIST | ✅     | ✅   | ❌     | ❌     |
| Others                 | ❌     | ❌   | ❌     | ❌     |

---

### Attendance Module

| Role               | Create | Read | Update | Approve | Export |
| ------------------ | ------ | ---- | ------ | ------- | ------ |
| SUPER_ADMIN        | ✅     | ✅   | ✅     | ✅      | ✅     |
| ADMIN              | ✅     | ✅   | ✅     | ✅      | ✅     |
| HR_MANAGER         | ❌     | ✅   | ❌     | ✅      | ✅     |
| DEPARTMENT_MANAGER | ❌     | ✅   | ✅     | ✅      | ✅     |
| TEAM_LEAD          | ❌     | ✅   | ❌     | ✅      | ❌     |
| EMPLOYEE           | ✅     | ✅   | ❌     | ❌      | ❌     |

---

### Payroll Module

| Role               | Create | Read | Update | Approve | Export |
| ------------------ | ------ | ---- | ------ | ------- | ------ |
| SUPER_ADMIN        | ✅     | ✅   | ✅     | ✅      | ✅     |
| ADMIN              | ✅     | ✅   | ✅     | ✅      | ✅     |
| CFO                | ✅     | ✅   | ✅     | ✅      | ✅     |
| FINANCE_MANAGER    | ✅     | ✅   | ✅     | ✅      | ✅     |
| PAYROLL_SPECIALIST | ✅     | ✅   | ✅     | ❌      | ✅     |
| HR_MANAGER         | ✅     | ✅   | ✅     | ✅      | ✅     |
| EMPLOYEE           | ❌     | ✅   | ❌     | ❌      | ❌     |

---

### Role Management

| Role        | Assign | Revoke | Create | Update |
| ----------- | ------ | ------ | ------ | ------ |
| SUPER_ADMIN | ✅     | ✅     | ✅     | ✅     |
| ADMIN       | ✅     | ✅     | ✅     | ✅     |
| CEO         | ✅     | ✅     | ✅     | ✅     |
| HR_DIRECTOR | ✅     | ✅     | ✅     | ✅     |
| HR_MANAGER  | ✅     | ✅     | ❌     | ❌     |
| Others      | ❌     | ❌     | ❌     | ❌     |

---

### Report Module

| Role                | View | Export |
| ------------------- | ---- | ------ |
| C-Level & Directors | ✅   | ✅     |
| Managers            | ✅   | ✅     |
| Team Leads          | ✅   | ❌     |
| Specialists         | ✅   | ✅     |
| Employees           | ✅   | ❌     |
| Interns             | ❌   | ❌     |

---

## 🎯 Use Cases

### Scenario 1: Hiring Process

```
1. RECRUITMENT_SPECIALIST creates employee record
2. HR_SPECIALIST creates user account
3. HR_MANAGER assigns EMPLOYEE role
4. EMPLOYEE can now login and access self-service
```

### Scenario 2: Department Management

```
1. HR_DIRECTOR creates department
2. CEO assigns DEPARTMENT_MANAGER
3. DEPARTMENT_MANAGER manages team attendance
4. TEAM_LEAD approves team attendance
```

### Scenario 3: Payroll Processing

```
1. PAYROLL_SPECIALIST creates payroll
2. FINANCE_MANAGER reviews and updates
3. FINANCE_DIRECTOR approves
4. EMPLOYEE views own payroll
```

---

## 🔄 Role Assignment Logic

### In UserRoleSeeder:

```typescript
// Admin user → ADMIN role
if (user.email === 'admin@company.com') {
  → ADMIN role
}

// Based on employee job_level:
if (job_level === 'director') {
  → DIRECTOR role
}
else if (job_level === 'manager') {
  → MANAGER role
}
else if (job_level === 'lead') {
  → TEAM_LEAD role
}
else if (job_level === 'senior') {
  → SENIOR_EMPLOYEE role
}
else if (job_level === 'junior') {
  → JUNIOR_EMPLOYEE role
}
else {
  → EMPLOYEE role
}
```

---

## 📝 Notes

### is_assignable Flag:

- `true`: Can be manually assigned to users
- `false`: System use only (e.g., SUPER_ADMIN)

### Level System:

- Lower number = Higher authority
- Used for permission hierarchies
- Helps determine access levels

### Permission Inheritance:

- Higher roles typically have more permissions
- Some roles have specialized permissions
- Self-service permissions available to all employees

---

**Total Roles: 28**

- Executive: 5 roles
- Director: 4 roles
- Manager: 5 roles
- Team Lead: 2 roles
- Specialist: 4 roles
- Employee: 3 roles
- Temporary: 5 roles
