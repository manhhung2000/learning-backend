'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@shared/components/ui/Input'
import { Button } from '@shared/components/ui/Button'
import type { CognitoUser } from '@lib/api/users.api'

const ROLES = ['ADMIN', 'TEACHER', 'STUDENT']

interface FormValues {
  name: string
  email: string
  role: string
}

interface UserFormProps {
  editing?: CognitoUser | null
  error?: string | null
  onSubmit: (values: FormValues, file?: File | null) => Promise<void>
  onCancel: () => void
}

export const UserForm = ({ editing, error, onSubmit, onCancel }: UserFormProps) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(editing?.avatarUrl ?? null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: editing?.name ?? '',
      email: editing?.email ?? '',
      role: editing?.role ?? 'STUDENT',
    },
  })

  const handleFormSubmit = (values: FormValues) => {
    const file = fileRef.current?.files?.[0]
    if (file) return onSubmit(values, file)
    if (preview === null && editing?.avatarUrl) return onSubmit(values, null)
    return onSubmit(values)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleRemoveAvatar = () => {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />

      {!editing && (
        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Avatar</label>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
            {preview ? (
              <img src={preview} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-slate-400 text-xl">
                {editing?.name?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 bg-white text-sm text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
          </div>
          <input
            id="avatar-upload"
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Role</label>
        <select
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          {...register('role', { required: 'Role is required' })}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {editing ? 'Update' : 'Create user'}
        </Button>
      </div>
    </form>
  )
}
