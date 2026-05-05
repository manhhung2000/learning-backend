'use client'

import { useState } from 'react'
import { useClasses } from '@features/classes/hooks/useClasses'
import { ClassTable } from '@features/classes/components/ClassTable'
import { ClassForm } from '@features/classes/components/ClassForm'
import { useAuthStore } from '@store/auth.store'
import { Button } from '@shared/components/ui/Button'
import type { Class } from '@models/api.types'

export default function ClassesPage() {
  const { data, total, page, limit, loading, goToPage, create, update, remove } = useClasses()
  const { user } = useAuthStore()
  const role = user?.role
  const [selected, setSelected] = useState<Class | null | 'new'>(null)

  const canEdit = role === 'ADMIN' || role === 'TEACHER'
  const canDelete = role === 'ADMIN'

  const handleSave = async (id: number | null, formData: Parameters<typeof create>[0]) => {
    if (id) await update(id, formData)
    else await create(formData)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Classes</h1>
        {canEdit && <Button onClick={() => setSelected('new')}>+ Add new</Button>}
      </div>
      <ClassTable
        data={data}
        total={total}
        page={page}
        limit={limit}
        loading={loading}
        canEdit={canEdit}
        canDelete={canDelete}
        onPageChange={goToPage}
        onEdit={(cls) => setSelected(cls)}
        onDelete={remove}
      />
      {selected !== null && (
        <ClassForm
          initial={selected === 'new' ? null : selected}
          onSave={handleSave}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
