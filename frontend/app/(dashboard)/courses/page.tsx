'use client'

import { useState } from 'react'
import { useCourses } from '@features/courses/hooks/useCourses'
import { CourseTable } from '@features/courses/components/CourseTable'
import { CourseForm } from '@features/courses/components/CourseForm'
import { useAuthStore } from '@store/auth.store'
import { Button } from '@shared/components/ui/Button'
import type { Course } from '@models/api.types'

export default function CoursesPage() {
  const { data, total, page, limit, loading, goToPage, create, update, remove } = useCourses()
  const { user } = useAuthStore()
  const role = user?.role
  const [selected, setSelected] = useState<Course | null | 'new'>(null)

  const canEdit = role === 'ADMIN' || role === 'TEACHER'
  const canDelete = role === 'ADMIN'

  const handleSave = async (id: number | null, formData: Parameters<typeof create>[0]) => {
    if (id) await update(id, formData)
    else await create(formData)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Courses</h1>
        {canEdit && <Button onClick={() => setSelected('new')}>+ Add new</Button>}
      </div>
      <CourseTable
        data={data}
        total={total}
        page={page}
        limit={limit}
        loading={loading}
        canEdit={canEdit}
        canDelete={canDelete}
        onPageChange={goToPage}
        onEdit={(course) => setSelected(course)}
        onDelete={remove}
      />
      {selected !== null && (
        <CourseForm
          initial={selected === 'new' ? null : selected}
          onSave={handleSave}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
