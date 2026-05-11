'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@shared/components/layout/ProtectedRoute'
import { UserTable } from '@features/users/components/UserTable'
import { UserForm } from '@features/users/components/UserForm'
import { Modal } from '@shared/components/ui/Modal'
import { Button } from '@shared/components/ui/Button'
import { useUsers } from '@features/users/hooks/useUsers'
import type { CognitoUser } from '@lib/api/users.api'

export default function UsersPage() {
  const { data, loading, error, create, update, remove } = useUsers()
  const [editing, setEditing] = useState<CognitoUser | null>(null)
  const [creating, setCreating] = useState(false)

  const handleCreate = async (
    values: { name: string; email: string; role: string },
    file?: File,
  ) => {
    try {
      await create({ ...values, file })
      setCreating(false)
    } catch {}
  }

  const handleUpdate = async (
    values: { name: string; email: string; role: string },
    file?: File | null,
  ) => {
    if (!editing) return
    try {
      await update(editing.username, { name: values.name, role: values.role, file })
      setEditing(null)
    } catch {}
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Users</h1>
          <Button onClick={() => setCreating(true)}>+ Add user</Button>
        </div>

        <UserTable
          data={data}
          loading={loading}
          onEdit={(user) => setEditing(user)}
          onDelete={remove}
        />

        <Modal open={creating} onClose={() => setCreating(false)} title="Create user">
          <UserForm error={error} onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </Modal>

        <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit role">
          <UserForm
            editing={editing}
            error={error}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  )
}
