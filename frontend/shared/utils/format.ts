export const formatDate = (date: string | null | undefined) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formatRole = (role: string) => {
  const map: Record<string, string> = {
    ADMIN: 'Admin',
    TEACHER: 'Teacher',
    STUDENT: 'Student',
  }
  return map[role] ?? role
}

export const formatEnrollmentStatus = (status: string) => {
  const map: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    dropped: 'Dropped',
  }
  return map[status] ?? status
}
