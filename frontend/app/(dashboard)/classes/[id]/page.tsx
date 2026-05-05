'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { classesApi } from '@lib/api/classes.api'
import { Table } from '@shared/components/ui/Table'
import { formatRole } from '@shared/utils/format'
import type { Class, User } from '@models/api.types'

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [cls, setCls] = useState<Class | null>(null)
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [classData, studentData] = await Promise.all([
        classesApi.findOne(Number(id)),
        classesApi.getStudents(Number(id)),
      ])
      setCls(classData)
      setStudents(studentData)
      setLoading(false)
    }
    load()
  }, [id])

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (row: User) => formatRole(row.role) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{cls?.name ?? '...'}</h1>
        <p className="text-sm text-gray-500">{cls?.description}</p>
      </div>
      <div>
        <h2 className="mb-3 text-base font-medium text-gray-700">Students</h2>
        <Table
          columns={columns}
          data={students}
          loading={loading}
          emptyText="No students enrolled"
        />
      </div>
    </div>
  )
}
