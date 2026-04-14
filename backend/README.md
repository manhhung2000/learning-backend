# Learning Management System (LMS) - Backend

A robust Learning Management System built with NestJS, providing comprehensive class, course, and enrollment management features for Teachers and Students.

## 🚀 Technical Stack

- **Framework**: [NestJS](https://nestjs.com/) (v11)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (v15)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: JWT (Passport-JWT)
- **Infrastructure**: Docker & Docker Compose
- **Tools**: Adminer (Database Management)

## 📂 Project Structure & Architecture

The project follows a **Module-based** architecture and utilizes **TypeScript Import Aliases** for optimal maintainability:

- `@modules/`: Core business modules (User, Class, Course, Enrollment).
- `@common/`: Shared components (Guards, Decorators, Global DTOs).
- `@src/`: Root path to the source directory.

## ⚙️ Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js (v18+) & npm

### 2. Environment Setup
Create a `.env` file in the root directory with the following content:
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=school
JWT_SECRET=yoursecretkey
```

### 3. Run Infrastructure (Database & Adminer)
Use Docker to start PostgreSQL and Adminer:
```bash
docker compose up -d
```
- **Postgres**: Running on port `5433`.
- **Adminer**: Accessible at [http://localhost:8080](http://localhost:8080) (Server: `db`, User/Pass: `postgres`).

### 4. Run Application
```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev
```

## 🛠 Key API Endpoints

### Authentication (`/auth`)
- `POST /auth/register`: Register an account (Roles: TEACHER, STUDENT, ADMIN).
- `POST /auth/login`: Login and receive a JWT Access Token.

### Class Management (`/classes`)
- `POST /classes`: Create a new class (Requires ADMIN/TEACHER role).
- `GET /classes`: Fetch all classes (with pagination).

### Course Management (`/courses`)
- `POST /courses`: Create a course (linked to a Teacher and a Class).
- `GET /courses`: Fetch all courses.

### Student Enrollments (`/enrollments`)
- `POST /enrollments`: Enroll a student into a specific course.

## 🧹 Code Standards
The project uses **Prettier** for consistent code formatting:
```bash
npm run format
```

---
**Status**: Stable and Handover Ready.
