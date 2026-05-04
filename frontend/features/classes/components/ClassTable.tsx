'use client'

import { useRouter } from 'next/navigation'
import { Table } from '@shared/components/ui/Table'
import { Button } from '@shared/components/ui/Button'
import { Pagination } from '@shared/components/ui/Pagination'
import type { Class } from '@models/api.types'

interface ClassTableProps {
  data: Class[]
  total: number
  page: number
  limit: number
  loading: boolean
  canEdit: boolean
  canDelete?: boolean
  onPageChange: (page: number) => void
  onEdit: (cls: Class) => void
  onDelete: (id: number) => void
}

export const ClassTable = ({
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
}: ClassTableProps) => {
  const router = useRouter()

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'actions',
      header: '',
      render: (row: Class) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/classes/${row.id}`)}>
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
