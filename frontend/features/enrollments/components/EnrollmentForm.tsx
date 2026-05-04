'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@shared/components/ui/Modal'
import { Input } from '@shared/components/ui/Input'
import { Button } from '@shared/components/ui/Button'
import { coursesApi } from '@lib/api/courses.api'
import type { Course } from '@models/api.types'

interface FormValues {
  cognitoId: string
  courseId: number
}

interface EnrollmentFormProps {
  onSave: (data: FormValues) => Promise<void>
  onClose: () => void
}

const selectCls =
  'rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 w-full'

export const EnrollmentForm = ({ onSave, onClose }: EnrollmentFormProps) => {
  const [courses, setCourses] = useState<Course[]>([])

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: { cognitoId: '', courseId: 0 },
  })

  useEffect(() => {
    coursesApi.findAll(1, 100).then((r) => setCourses(r.data))
  }, [])

  const onSubmit = async (data: FormValues) => {
    await onSave({ ...data, courseId: Number(data.courseId) })
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Add Enrollment">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Student Cognito ID (sub)"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          error={errors.cognitoId?.message}
          {...register('cognitoId', { required: 'Required' })}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Course</label>
          <select
            className={selectCls}
            {...register('courseId', { validate: (v) => Number(v) > 0 || 'Required' })}
          >
            <option value={0}>Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subjectName} ({c.academicYear} — {c.semester})
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Enroll
          </Button>
        </div>
      </form>
    </Modal>
  )
}
