'use client'

import { Table } from '@shared/components/ui/Table'
import { Badge } from '@shared/components/ui/Badge'
import { Button } from '@shared/components/ui/Button'
import { Pagination } from '@shared/components/ui/Pagination'
import { formatDate, formatEnrollmentStatus } from '@shared/utils/format'
import type { Enrollment, EnrollmentStatus } from '@models/api.types'

const statusVariant: Record<EnrollmentStatus, 'success' | 'warning' | 'danger'> = {
  active: 'success',
  inactive: 'warning',
  dropped: 'danger',
}

interface EnrollmentTableProps {
  data: Enrollment[]
  total: number
  page: number
  limit: number
  loading: boolean
  canManage: boolean
  canDelete?: boolean
  onPageChange: (page: number) => void
  onStatusChange: (id: number, status: EnrollmentStatus) => void
  onDelete: (id: number) => void
}

export const EnrollmentTable = ({
  data,
  total,
  page,
  limit,
  loading,
  canManage,
  canDelete = canManage,
  onPageChange,
  onStatusChange,
  onDelete,
}: EnrollmentTableProps) => {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'studentId', header: 'Student ID' },
    { key: 'courseId', header: 'Course ID' },
    {
      key: 'enrolledAt',
      header: 'Enrolled At',
      render: (row: Enrollment) => formatDate(row.enrolledAt),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Enrollment) => (
        <Badge variant={statusVariant[row.status]}>{formatEnrollmentStatus(row.status)}</Badge>
      ),
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: '',
            render: (row: Enrollment) => (
              <div className="flex gap-2">
                {row.status !== 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStatusChange(row.id, 'active')}
                  >
                    Activate
                  </Button>
                )}
                {row.status === 'active' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onStatusChange(row.id, 'inactive')}
                  >
                    Deactivate
                  </Button>
                )}
                {canDelete && (
                  <Button variant="danger" size="sm" onClick={() => onDelete(row.id)}>
                    Delete
                  </Button>
                )}
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
