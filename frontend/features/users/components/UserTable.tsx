'use client'

import { Table } from '@shared/components/ui/Table'
import { Badge } from '@shared/components/ui/Badge'
import { Button } from '@shared/components/ui/Button'
import { Pagination } from '@shared/components/ui/Pagination'
import { formatDate, formatRole } from '@shared/utils/format'
import type { User } from '@models/api.types'

interface UserTableProps {
  data: User[]
  total: number
  page: number
  limit: number
  loading: boolean
  canEdit: boolean
  onPageChange: (page: number) => void
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

export const UserTable = ({
  data,
  total,
  page,
  limit,
  loading,
  canEdit,
  onPageChange,
  onEdit,
  onDelete,
}: UserTableProps) => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row: User) => (
        <Badge
          variant={row.role === 'ADMIN' ? 'danger' : row.role === 'TEACHER' ? 'info' : 'default'}
        >
          {formatRole(row.role)}
        </Badge>
      ),
    },
    { key: 'createdAt', header: 'Created', render: (row: User) => formatDate(row.createdAt) },
    ...(canEdit
      ? [
          {
            key: 'actions',
            header: '',
            render: (row: User) => (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(row.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-2">
      <Table columns={columns} data={data} loading={loading} />
      <Pagination page={page} total={total} limit={limit} onPageChange={onPageChange} />
    </div>
  )
}
