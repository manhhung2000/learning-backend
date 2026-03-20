# School Management System - Database Architecture

## Tổng quan kiến trúc

Hệ thống gồm **6 bảng** với quan hệ rõ ràng theo business logic.

---

## Sơ đồ Database

```mermaid
erDiagram
    Student ||--o{ Enrollment : "enrolls"
    Class ||--o{ Enrollment : "has"

    Class ||--o{ Course : "offers"
    Subject ||--o{ Course : "is offered in"
    Teacher ||--o{ Course : "teaches"

    Enrollment {
        int id PK
        int student_id FK
        int class_id FK
        timestamp enrolled_at
        enum status
    }

    Course {
        int id PK
        int teacher_id FK
        int subject_id FK
        int class_id FK
        string academic_year
        string semester
        json schedule
        date start_date
        date end_date
    }
```

---

## Chi tiết 6 bảng

### 1. Student (Học sinh)

| Field | Type    | Ý nghĩa      |
| ----- | ------- | ------------ |
| id    | INT     | Khóa chính   |
| name  | VARCHAR | Tên học sinh |
| age   | INT     | Tuổi         |
| email | VARCHAR | Email        |

### 2. Class (Lớp học)

| Field       | Type    | Ý nghĩa    |
| ----------- | ------- | ---------- |
| id          | INT     | Khóa chính |
| name        | VARCHAR | Tên lớp    |
| description | VARCHAR | Mô tả      |

### 3. Subject (Môn học)

| Field       | Type    | Ý nghĩa    |
| ----------- | ------- | ---------- |
| id          | INT     | Khóa chính |
| name        | VARCHAR | Tên môn    |
| code        | VARCHAR | Mã môn     |
| description | VARCHAR | Mô tả      |
| credits     | INT     | Số tín chỉ |

### 4. Teacher (Giáo viên)

| Field          | Type    | Ý nghĩa       |
| -------------- | ------- | ------------- |
| id             | INT     | Khóa chính    |
| name           | VARCHAR | Tên giáo viên |
| email          | VARCHAR | Email         |
| phone          | VARCHAR | Số điện thoại |
| specialization | VARCHAR | Chuyên môn    |

### 5. Enrollment (Đăng ký học)

| Field       | Type      | Ý nghĩa                              | Delete Rule |
| ----------- | --------- | ------------------------------------ | ----------- |
| id          | INT       | Khóa chính                           |             |
| student_id  | INT       | FK → Student                         | CASCADE     |
| class_id    | INT       | FK → Class                           | CASCADE     |
| enrolled_at | TIMESTAMP | Ngày đăng ký                         |             |
| status      | ENUM      | Trạng thái (active/inactive/dropped) |             |

### 6. Course (Khóa học/Lớp môn)

| Field         | Type    | Ý nghĩa        | Delete Rule |
| ------------- | ------- | -------------- | ----------- |
| id            | INT     | Khóa chính     |             |
| teacher_id    | INT     | FK → Teacher   | RESTRICT    |
| subject_id    | INT     | FK → Subject   | RESTRICT    |
| class_id      | INT     | FK → Class     | RESTRICT    |
| academic_year | VARCHAR | Năm học        |             |
| semester      | VARCHAR | Học kỳ         |             |
| schedule      | JSON    | Thời khóa biểu |             |
| start_date    | DATE    | Ngày bắt đầu   |             |
| end_date      | DATE    | Ngày kết thúc  |             |

---

## Giải thích quan hệ

### Enrollment = "Học sinh đăng ký lớp"

- **Ai?** Student
- **Đăng ký cái gì?** Class
- **Khi nào?** enrolled_at
- **Trạng thái?** status
- **Tại sao cần?** Để tracking việc học sinh có đang học lớp đó không

### Course = "Giáo viên dạy môn cho lớp"

- **Ai dạy?** Teacher
- **Dạy gì?** Subject
- **Cho ai?** Class
- **Khi nào?** academic_year, semester
- **Tại sao cần?** Để biết ai dạy môn gì cho lớp nào, năm học nào

---

## API Endpoints

### Students

- `POST /students` - Tạo học sinh
- `GET /students` - Danh sách học sinh
- `GET /students/:id` - Chi tiết học sinh
- `PATCH /students/:id` - Cập nhật học sinh
- `DELETE /students/:id` - Xóa học sinh

### Classes

- `POST /classes` - Tạo lớp
- `GET /classes` - Danh sách lớp
- `GET /classes/:id` - Chi tiết lớp
- `POST /classes/:id/students` - Thêm học sinh vào lớp

### Subjects

- `POST /subjects` - Tạo môn học
- `GET /subjects` - Danh sách môn học

### Teachers

- `POST /teachers` - Tạo giáo viên
- `GET /teachers` - Danh sách giáo viên

### Enrollments

- `POST /enrollments` - Đăng ký học
- `GET /enrollments` - Danh sách đăng ký
- `GET /enrollments/class/:classId` - Đăng ký theo lớp
- `GET /enrollments/student/:studentId` - Đăng ký theo học sinh

### Courses

- `POST /courses` - Tạo khóa học
- `GET /courses` - Danh sách khóa học
- `GET /courses/class/:classId` - Khóa học theo lớp
- `GET /courses/teacher/:teacherId` - Khóa học theo giáo viên
