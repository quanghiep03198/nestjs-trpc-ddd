# 🌱 Quick Start Guide - Factories & Seeders

## 📦 Cài đặt

Đảm bảo đã cài `typeorm-extension`:

```bash
pnpm install typeorm-extension
```

---

## 🚀 Chạy Seeders

### 1. Chạy tất cả seeders (lần đầu)

```bash
# Development
npm run seed --host=localhost

# Hoặc dùng IP
npm run seed --host=192.168.1.100
```

### 2. Reset toàn bộ database và seed lại

```bash
npm run seed:refresh --host=localhost
```

### 3. Chạy migrations rồi seed

```bash
npm run migration:run --host=localhost
npm run seed --host=localhost
```

---

## 📋 Kết quả sau khi seed

| Entity           | Số lượng | Ghi chú                     |
| ---------------- | -------- | --------------------------- |
| Permissions      | 30       | All modules                 |
| Roles            | 3        | ADMIN, HR_MANAGER, EMPLOYEE |
| Departments      | 10       | 5 main + 5 sub              |
| Positions        | 70       | 7 levels × 10 depts         |
| Employees        | 100      | With dept & position        |
| Users            | 51       | 1 admin + 50 employees      |
| User-Roles       | 51       | All users have roles        |
| Role-Permissions | ~70      | Permissions assigned        |

---

## 🔑 Default Accounts

### Admin Account

```
Email: admin@company.com
Password: Admin@123456
Role: ADMIN
```

### Employee Accounts (50 users)

```
Email: employee{id}@company.com
Password: Password@123
Role: EMPLOYEE hoặc HR_MANAGER (tùy job_level)
```

---

## 🔄 Thứ tự Seeders

Seeders tự động chạy theo thứ tự timestamp:

```
1. Permission (1762200100000)
2. Role (1762200000000)
3. RolePermission (1762200200000) ← Gán permissions cho roles
4. Department (1762200300000) ← Tạo departments
5. Position (1762200400000) ← Tạo positions
6. Employee (1762200500000) ← Tạo employees
7. User (1762200600000) ← Tạo users, link employees
8. UserRole (1762200700000) ← Gán roles cho users
```

---

## 🔧 Tạo seeder mới

```bash
npm run seed:create --name=MyNewSeeder
```

File mới sẽ được tạo tại: `src/databases/seeds/{timestamp}-MyNewSeeder.seeder.ts`

---

## 📖 Xem chi tiết

Đọc file đầy đủ tại: [`resources/DATABASE_FACTORIES_SEEDERS.md`](../resources/DATABASE_FACTORIES_SEEDERS.md)

---

## ⚠️ Lưu ý

1. **Luôn chạy migrations trước khi seed**
2. **Seeders có check exists** - an toàn chạy nhiều lần
3. **Dữ liệu random** - mỗi lần chạy khác nhau
4. **Foreign keys tự động** - relationships được tạo đúng

---

## 🐛 Troubleshooting

### Lỗi: Cannot find module 'typeorm-extension'

```bash
pnpm install typeorm-extension
```

### Lỗi: Foreign key constraint

```bash
# Đảm bảo chạy migrations trước
npm run migration:run --host=localhost
npm run seed --host=localhost
```

### Lỗi: Connection refused

```bash
# Check DB host và port trong .env
DB_HOST=localhost
DB_PORT=1433
```

---

**Happy Coding! 🎉**
