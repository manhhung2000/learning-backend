'use client'

import { useState } from 'react'
import { useEnrollments } from '@features/enrollments/hooks/useEnrollments'
import { EnrollmentTable } from '@features/enrollments/components/EnrollmentTable'
import { EnrollmentForm } from '@features/enrollments/components/EnrollmentForm'
import { useAuthStore } from '@store/auth.store'
import { Button } from '@shared/components/ui/Button'

export default function EnrollmentsPage() {
  const { data, total, page, limit, loading, goToPage, create, updateStatus, remove } =
    useEnrollments()
  const { role } = useAuthStore()
  const [showForm, setShowForm] = useState(false)

  const canManage = role === 'ADMIN' || role === 'TEACHER'
  const canDelete = role === 'ADMIN'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Enrollments</h1>
        <Button onClick={() => setShowForm(true)}>+ Add new</Button>
      </div>
      <EnrollmentTable
        data={data}
        total={total}
        page={page}
        limit={limit}
        loading={loading}
        canManage={canManage}
        canDelete={canDelete}
        onPageChange={goToPage}
        onStatusChange={updateStatus}
        onDelete={remove}
      />
      {showForm && <EnrollmentForm onSave={create} onClose={() => setShowForm(false)} />}
    </div>
  )
}
