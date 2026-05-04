'use client'

import { useForm } from 'react-hook-form'
import { Modal } from '@shared/components/ui/Modal'
import { Input } from '@shared/components/ui/Input'
import { Button } from '@shared/components/ui/Button'
import type { Class } from '@models/api.types'

interface FormValues {
  name: string
  description: string
}

interface ClassFormProps {
  initial: Class | null
  onSave: (id: number | null, data: FormValues) => Promise<void>
  onClose: () => void
}

export const ClassForm = ({ initial, onSave, onClose }: ClassFormProps) => {
  const isEdit = !!initial?.id
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: initial?.name ?? '', description: initial?.description ?? '' },
  })

  const onSubmit = async (data: FormValues) => {
    await onSave(initial?.id ?? null, data)
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit Class' : 'Add Class'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Class name"
          error={errors.name?.message}
          {...register('name', { required: 'Required' })}
        />
        <Input
          label="Description"
          error={errors.description?.message}
          {...register('description', { required: 'Required' })}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
