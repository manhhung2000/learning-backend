import client from '@lib/api/client'

export interface CognitoUser {
  username: string
  email: string
  name: string
  status: string
  role: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface CreateUserPayload {
  name: string
  email: string
  role: string
  file?: File
}

export const usersApi = {
  findAll: () => client.get<CognitoUser[]>('/users').then((r) => r.data),

  create: (payload: CreateUserPayload) => {
    const form = new FormData()
    form.append('name', payload.name)
    form.append('email', payload.email)
    form.append('role', payload.role)
    if (payload.file) form.append('file', payload.file)
    return client
      .post('/users', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },

  update: (username: string, payload: { name?: string; role?: string; file?: File | null }) => {
    const form = new FormData()
    if (payload.name) form.append('name', payload.name)
    if (payload.role) form.append('role', payload.role)
    if (payload.file) form.append('file', payload.file)
    else if (payload.file === null) form.append('file', new Blob([]))
    return client
      .put<{ avatarUrl?: string }>(`/users/${encodeURIComponent(username)}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  remove: (username: string) =>
    client.delete(`/users/${encodeURIComponent(username)}`).then((r) => r.data),
}
