import client from '@lib/api/client'
import type { Enrollment, EnrollmentStatus, PaginatedResponse } from '@models/api.types'

interface CreateEnrollmentPayload {
  cognitoId: string
  courseId: number
}

export const enrollmentsApi = {
  findAll: (page = 1, limit = 10) =>
    client
      .get<PaginatedResponse<Enrollment>>('/enrollments', { params: { page, limit } })
      .then((r) => r.data),

  findOne: (id: number) => client.get<Enrollment>(`/enrollments/${id}`).then((r) => r.data),

  findByCourse: (courseId: number) =>
    client.get<Enrollment[]>(`/enrollments/course/${courseId}`).then((r) => r.data),

  findByStudent: (studentId: number) =>
    client.get<Enrollment[]>(`/enrollments/student/${studentId}`).then((r) => r.data),

  create: (payload: CreateEnrollmentPayload) =>
    client.post<Enrollment>('/enrollments', payload).then((r) => r.data),

  updateStatus: (id: number, status: EnrollmentStatus) =>
    client.put<Enrollment>(`/enrollments/${id}/status`, { status }).then((r) => r.data),

  remove: (id: number) => client.delete(`/enrollments/${id}`).then((r) => r.data),
}
