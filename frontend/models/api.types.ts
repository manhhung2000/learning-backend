export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface User {
  id: number
  cognitoId: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export type EnrollmentStatus = 'active' | 'inactive' | 'dropped'

export interface Class {
  id: number
  name: string
  description: string
}

export interface Course {
  id: number
  cognitoId: string
  subjectName: string
  classId: number
  academicYear: string
  semester: string
  schedule: Record<string, unknown> | null
  startDate: string | null
  endDate: string | null
  thumbnailKey: string | null
  createdAt: string
  class?: Class
}

export interface Enrollment {
  id: number
  cognitoId: string
  courseId: number
  enrolledAt: string
  status: EnrollmentStatus
  createdAt: string
  updatedAt: string
  course?: Course
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  currentPage: number
  pageSize: number
  totalPage: number
}

export interface ApiError {
  message: string
  statusCode: number
}
