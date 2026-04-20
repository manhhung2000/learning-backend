# Learning Management System — Backend

NestJS REST API for managing classes, courses, and student enrollments with JWT-based authentication and role-based access control.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS v11 |
| Database | PostgreSQL 15 |
| ORM | TypeORM |
| Auth | JWT (Passport-JWT) |
| Infrastructure | Docker & Docker Compose |

## Project Structure

```
backend/
├── src/
│   ├── common/                  # Guards, decorators, shared DTOs
│   ├── modules/
│   │   ├── class-management/    # Classes, Courses, Enrollments
│   │   └── user-management/     # Auth, Users
│   └── main.ts
├── devops/
│   ├── docker/
│   │   ├── Dockerfile           # Multi-stage (development / production)
│   │   └── entrypoint.sh
│   └── compose/
│       ├── docker-compose.dev.yml
│       └── docker-compose.prd.yml
└── .dockerignore
```

**TypeScript path aliases:**
- `@modules/` → `src/modules/`
- `@common/` → `src/common/`
- `@src/` → `src/`

## Getting Started

### 1. Environment

Create `.env` in the `backend/` directory:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=school

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Run with Docker (recommended)

```bash
# Development — hot reload, Adminer included
docker compose -f ./devops/compose/docker-compose.dev.yml --env-file .env up --build

# Production
docker compose -f ./devops/compose/docker-compose.prd.yml --env-file .env up --build
```

- **API**: `http://localhost:3000`
- **Adminer**: `http://localhost:8080` — Server: `db`, User/Pass: `postgres`

### 3. Run locally (without Docker)

```bash
npm install
npm run start:dev
```

> Requires a running PostgreSQL instance with credentials matching `.env`.

## API Endpoints

### Auth — `/auth`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register (roles: ADMIN, TEACHER, STUDENT) | — |
| POST | `/auth/login` | Login, returns JWT access token | — |

### Classes — `/classes`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/classes` | Create a class | ADMIN, TEACHER |
| GET | `/classes` | List all classes (paginated) | JWT |

### Courses — `/courses`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/courses` | Create a course | ADMIN, TEACHER |
| GET | `/courses` | List all courses (paginated) | JWT |

### Enrollments — `/enrollments`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/enrollments` | Enroll a student in a course | JWT |

## Scripts

```bash
npm run start:dev   # Development with hot reload
npm run build       # Compile TypeScript
npm run start:prod  # Run compiled output
npm run lint        # ESLint
npm run format      # Prettier
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```
