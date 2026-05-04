'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@shared/components/ui/Modal'
import { Input } from '@shared/components/ui/Input'
import { Button } from '@shared/components/ui/Button'
import { classesApi } from '@lib/api/classes.api'
import type { Course, Class } from '@models/api.types'

interface FormValues {
  cognitoId: string
  subjectName: string
  classId: number
  academicYear: string
  semester: string
  startDate: string
  endDate: string
}

interface CourseFormProps {
  initial: Course | null
  onSave: (id: number | null, data: FormValues) => Promise<void>
  onClose: () => void
}

const selectCls =
  'rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100'

export const CourseForm = ({ initial, onSave, onClose }: CourseFormProps) => {
  const isEdit = !!initial?.id
  const [classes, setClasses] = useState<Class[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      cognitoId: initial?.cognitoId ?? '',
      subjectName: initial?.subjectName ?? '',
      classId: initial?.classId ?? 0,
      academicYear: initial?.academicYear ?? '',
      semester: initial?.semester ?? '',
      startDate: initial?.startDate?.slice(0, 10) ?? '',
      endDate: initial?.endDate?.slice(0, 10) ?? '',
    },
  })

  useEffect(() => {
    classesApi.findAll(1, 100).then((r) => setClasses(r.data))
  }, [])

  const onSubmit = async (data: FormValues) => {
    await onSave(initial?.id ?? null, { ...data, classId: Number(data.classId) })
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit Course' : 'Add Course'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Teacher Cognito ID (sub)"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          error={errors.cognitoId?.message}
          {...register('cognitoId', { required: 'Required' })}
        />
        <Input
          label="Subject name"
          error={errors.subjectName?.message}
          {...register('subjectName', { required: 'Required' })}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Class</label>
            <select
              className={selectCls}
              {...register('classId', { validate: (v) => Number(v) > 0 || 'Required' })}
            >
              <option value={0}>Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Academic year"
            placeholder="2024-2025"
            error={errors.academicYear?.message}
            {...register('academicYear', { required: 'Required' })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Semester"
            placeholder="1"
            error={errors.semester?.message}
            {...register('semester', { required: 'Required' })}
          />
          <Input label="Start date" type="date" {...register('startDate')} />
        </div>

        <Input label="End date" type="date" {...register('endDate')} />

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
