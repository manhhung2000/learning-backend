# School Management System

Hệ thống RESTful API quản lý trường học được xây dựng bằng NestJS và TypeORM.

## 📦 Tech Stack

| Layer     | Technology |
| --------- | ---------- |
| Runtime   | Node.js    |
| Framework | NestJS     |
| ORM       | TypeORM    |
| Database  | PostgreSQL |
| Language  | TypeScript |

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                # Application entry point
│   ├── students/              # Student management
│   ├── classes/               # Class management
│   ├── teachers/              # Teacher management
│   ├── subjects/             # Subject management
│   ├── courses/               # Course (Class + Subject + Teacher)
│   └── enrollments/           # Enrollment (Student + Course)
```

## 🗄️ Database Schema

Hệ thống gồm **6 bảng** chính:

| Entity         | Mô tả                                                    | Quan hệ                 |
| -------------- | -------------------------------------------------------- | ----------------------- |
| **Student**    | Thông tin học sinh (name, age, email)                    | 1:n với Enrollment      |
| **Class**      | Thông tin lớp học (name, description)                    | 1:n với Course          |
| **Teacher**    | Thông tin giáo viên (name, email, phone, specialization) | 1:n với Course          |
| **Subject**    | Thông tin môn học (name, code, description, credits)     | 1:n với Course          |
| **Course**     | Lớp học phần kết hợp Class + Subject + Teacher           | 1:n với Enrollment      |
| **Enrollment** | Đăng ký học kết hợp Student + Course                     | n:1 với Student, Course |

### Quan hệ Database

- Student → Enrollment (1:n) - Học sinh đăng ký nhiều lớp học phần
- Course → Enrollment (1:n) - Lớp học phần có nhiều học sinh đăng ký
- Class → Course (1:n) - Lớp học mở nhiều lớp học phần
- Subject → Course (1:n) - Môn học được mở trong nhiều lớp học phần
- Teacher → Course (1:n) - Giáo viên dạy nhiều lớp học phần

## 🔌 API Endpoints

### Students

- `GET /students` - Lấy danh sách học sinh
- `GET /students/:id` - Lấy học sinh theo ID
- `POST /students` - Tạo học sinh mới
- `PATCH /students/:id` - Cập nhật học sinh
- `DELETE /students/:id` - Xóa học sinh

### Classes

- `GET /classes` - Lấy danh sách lớp học
- `GET /classes/:id` - Lấy lớp học theo ID
- `POST /classes` - Tạo lớp học mới
- `PATCH /classes/:id` - Cập nhật lớp học
- `DELETE /classes/:id` - Xóa lớp học

### Teachers

- `GET /teachers` - Lấy danh sách giáo viên
- `GET /teachers/:id` - Lấy giáo viên theo ID
- `POST /teachers` - Tạo giáo viên mới
- `PATCH /teachers/:id` - Cập nhật giáo viên
- `DELETE /teachers/:id` - Xóa giáo viên

### Subjects

- `GET /subjects` - Lấy danh sách môn học
- `GET /subjects/:id` - Lấy môn học theo ID
- `POST /subjects` - Tạo môn học mới
- `PATCH /subjects/:id` - Cập nhật môn học
- `DELETE /subjects/:id` - Xóa môn học

### Courses

- `GET /courses` - Lấy danh sách lớp học phần
- `GET /courses/:id` - Lấy lớp học phần theo ID
- `POST /courses` - Tạo lớp học phần mới
- `PATCH /courses/:id` - Cập nhật lớp học phần
- `DELETE /courses/:id` - Xóa lớp học phần

### Enrollments

- `GET /enrollments` - Lấy danh sách đăng ký học
- `GET /enrollments/:id` - Lấy đăng ký theo ID
- `POST /enrollments` - Tạo đăng ký học mới
- `PATCH /enrollments/:id` - Cập nhật đăng ký học
- `DELETE /enrollments/:id` - Xóa đăng ký học

## ⚙️ Configuration

```typescript
TypeOrmModule.forRoot({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "postgres",
  database: "school",
  entities: [Student, Class, Enrollment, Subject, Teacher, Course],
  synchronize: true,
});
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
cd backend
npm install
```

### Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📄 License

MIT
