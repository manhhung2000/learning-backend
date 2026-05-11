'use client'

import { Table } from '@shared/components/ui/Table'
import { Badge } from '@shared/components/ui/Badge'
import { Button } from '@shared/components/ui/Button'
import { formatDate } from '@shared/utils/format'
import type { CognitoUser } from '@lib/api/users.api'

const ROLE_VARIANT: Record<string, 'danger' | 'info' | 'default'> = {
  ADMIN: 'danger',
  TEACHER: 'info',
  STUDENT: 'default',
}

interface UserTableProps {
  data: CognitoUser[]
  loading: boolean
  onEdit: (user: CognitoUser) => void
  onDelete: (username: string) => void
}

export const UserTable = ({ data, loading, onEdit, onDelete }: UserTableProps) => {
  const columns = [
    {
      key: 'avatar',
      header: 'Avatar',
      render: (row: CognitoUser) =>
        row.avatarUrl ? (
          <img
            src={row.avatarUrl}
            alt={row.name}
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
            {row.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        ),
    },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row: CognitoUser) => (
        <Badge variant={ROLE_VARIANT[row.role ?? ''] ?? 'default'}>{row.role ?? 'No role'}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: CognitoUser) => (
        <Badge variant={row.status === 'CONFIRMED' ? 'info' : 'default'}>{row.status}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: CognitoUser) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      render: (row: CognitoUser) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(row.username)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
