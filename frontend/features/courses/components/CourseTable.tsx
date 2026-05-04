'use client'

import { useRouter } from 'next/navigation'
import { Table } from '@shared/components/ui/Table'
import { Button } from '@shared/components/ui/Button'
import { Pagination } from '@shared/components/ui/Pagination'
import { formatDate } from '@shared/utils/format'
import type { Course } from '@models/api.types'

interface CourseTableProps {
  data: Course[]
  total: number
  page: number
  limit: number
  loading: boolean
  canEdit: boolean
  canDelete?: boolean
  onPageChange: (page: number) => void
  onEdit: (course: Course) => void
  onDelete: (id: number) => void
}

export const CourseTable = ({
  data,
  total,
  page,
  limit,
  loading,
  canEdit,
  canDelete = canEdit,
  onPageChange,
  onEdit,
  onDelete,
}: CourseTableProps) => {
  const router = useRouter()

  const columns = [
    { key: 'subjectName', header: 'Subject' },
    { key: 'academicYear', header: 'Academic Year' },
    { key: 'semester', header: 'Semester' },
    { key: 'startDate', header: 'Start', render: (row: Course) => formatDate(row.startDate) },
    { key: 'endDate', header: 'End', render: (row: Course) => formatDate(row.endDate) },
    {
      key: 'actions',
      header: '',
      render: (row: Course) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/courses/${row.id}`)}>
            View
          </Button>
          {canEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
              Edit
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

  return (
    <div className="flex flex-col gap-2">
      <Table columns={columns} data={data} loading={loading} />
      <Pagination page={page} total={total} limit={limit} onPageChange={onPageChange} />
    </div>
  )
}
