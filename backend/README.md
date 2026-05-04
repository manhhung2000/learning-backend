# Learning Management System — Backend

NestJS REST API for managing classes, courses, and student enrollments with AWS Cognito-based authentication and role-based access control.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS v11 |
| Database | PostgreSQL 15 |
| ORM | TypeORM |
| Auth | AWS Cognito (Passport-JWT + JWKS) |
| Infrastructure | Docker & Docker Compose |

## Architecture

Authentication is delegated entirely to **AWS Cognito**. The backend never issues or stores tokens — it only verifies them.

```
Frontend (Amplify)          Backend (NestJS)             AWS Cognito
──────────────────          ────────────────             ───────────
signIn()              →     POST /...
                            Authorization: Bearer <idToken>
                                  │
                                  ▼
                            CognitoAuthGuard
                            CognitoStrategy
                                  │  fetch public key
                                  ├──────────────────→  /.well-known/jwks.json
                                  │  verify signature
                                  ◄──────────────────
                                  │
                            validate payload
                            (token_use === 'id',
                             audience === clientId)
                                  │
                            inject user into request
```

## Project Structure

```
backend/
├── src/
│   ├── common/
│   │   ├── guards/
│   │   │   ├── cognito-auth.guard.ts   # Passport guard for protected routes
│   │   │   └── roles.guard.ts          # Role-based access control
│   │   └── index.ts
│   ├── modules/
│   │   ├── class-management/
│   │   │   ├── classes/
│   │   │   ├── courses/
│   │   │   └── enrollments/
│   │   └── user-management/
│   │       └── auth/
│   │           ├── cognito.strategy.ts  # JWT verify via Cognito JWKS
│   │           └── auth.module.ts
│   └── main.ts
├── devops/
│   ├── docker/
│   │   ├── Dockerfile                  # Multi-stage (development / production)
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

Create `.env.development` in the `backend/` directory:

```env
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=school

COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Run with Docker (recommended)

```bash
# Development — hot reload, Adminer included
docker compose -f ./devops/compose/docker-compose.dev.yml --env-file .env.development up --build

# Production
docker compose -f ./devops/compose/docker-compose.prd.yml --env-file .env.production up --build
```

- **API**: `http://localhost:4000`
- **Adminer**: `http://localhost:8080` — Server: `db`, User/Pass: `postgres`

### 3. Run locally (without Docker)

```bash
npm install
npm run start:dev
```

> Requires a running PostgreSQL instance with credentials matching the env file.

## Authentication

All protected routes require an `Authorization: Bearer <idToken>` header where `idToken` is a Cognito **ID token** (not access token).

The backend validates:
1. JWT signature using Cognito's public JWKS endpoint
2. `iss` — must match the configured User Pool
3. `aud` — must match `COGNITO_CLIENT_ID`
4. `token_use` — must be `id`

User groups in Cognito map directly to roles (`ADMIN`, `TEACHER`, `STUDENT`).

## API Endpoints

### Classes — `/classes`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/classes` | Create a class | ADMIN, TEACHER |
| GET | `/classes` | List all classes (paginated) | Cognito |
| GET | `/classes/:id` | Get class by ID | Cognito |
| PUT | `/classes/:id` | Update a class | ADMIN, TEACHER |
| DELETE | `/classes/:id` | Delete a class | ADMIN |
| GET | `/classes/:id/students` | List students in a class | Cognito |

### Courses — `/courses`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/courses` | Create a course | ADMIN, TEACHER |
| GET | `/courses` | List all courses (paginated) | Cognito |
| GET | `/courses/:id` | Get course by ID | Cognito |
| GET | `/courses/class/:classId` | Courses by class | Cognito |
| GET | `/courses/teacher/:cognitoId` | Courses by teacher | Cognito |
| PUT | `/courses/:id` | Update a course | ADMIN, TEACHER |
| DELETE | `/courses/:id` | Delete a course | ADMIN |

### Enrollments — `/enrollments`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/enrollments` | Enroll a student | Cognito |
| GET | `/enrollments` | List all enrollments (paginated) | Cognito |
| GET | `/enrollments/:id` | Get enrollment by ID | Cognito |
| GET | `/enrollments/course/:courseId` | Enrollments by course | Cognito |
| GET | `/enrollments/student/:cognitoId` | Enrollments by student | Cognito |
| PUT | `/enrollments/:id` | Update enrollment | ADMIN, TEACHER |
| PUT | `/enrollments/:id/status` | Update enrollment status | ADMIN, TEACHER |
| DELETE | `/enrollments/:id` | Delete enrollment | ADMIN |

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
