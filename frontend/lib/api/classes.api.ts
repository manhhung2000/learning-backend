import client from '@lib/api/client'
import type { Class, User, PaginatedResponse } from '@models/api.types'

interface ClassPayload {
  name: string
  description: string
}

export const classesApi = {
  findAll: (page = 1, limit = 10) =>
    client
      .get<PaginatedResponse<Class>>('/classes', { params: { page, limit } })
      .then((r) => r.data),

  findOne: (id: number) => client.get<Class>(`/classes/${id}`).then((r) => r.data),

  getStudents: (id: number) => client.get<User[]>(`/classes/${id}/students`).then((r) => r.data),

  create: (payload: ClassPayload) => client.post<Class>('/classes', payload).then((r) => r.data),

  update: (id: number, payload: Partial<ClassPayload>) =>
    client.put<Class>(`/classes/${id}`, payload).then((r) => r.data),

  remove: (id: number) => client.delete(`/classes/${id}`).then((r) => r.data),
}
