import client from '@lib/api/client'
import type { Course, PaginatedResponse } from '@models/api.types'

interface CoursePayload {
  subjectName: string
  teacherId: number
  classId: number
  academicYear: string
  semester: string
  schedule?: Record<string, unknown>
  startDate?: string
  endDate?: string
}

export const coursesApi = {
  findAll: (page = 1, limit = 10) =>
    client
      .get<PaginatedResponse<Course>>('/courses', { params: { page, limit } })
      .then((r) => r.data),

  findOne: (id: number) => client.get<Course>(`/courses/${id}`).then((r) => r.data),

  findByClass: (classId: number) =>
    client.get<Course[]>(`/courses/class/${classId}`).then((r) => r.data),

  findByTeacher: (teacherId: number) =>
    client.get<Course[]>(`/courses/teacher/${teacherId}`).then((r) => r.data),

  create: (payload: CoursePayload) => client.post<Course>('/courses', payload).then((r) => r.data),

  update: (id: number, payload: Partial<CoursePayload>) =>
    client.put<Course>(`/courses/${id}`, payload).then((r) => r.data),

  remove: (id: number) => client.delete(`/courses/${id}`).then((r) => r.data),
}
