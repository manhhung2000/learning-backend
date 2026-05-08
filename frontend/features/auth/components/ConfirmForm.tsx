'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@shared/components/ui/Input'
import { Button } from '@shared/components/ui/Button'
import { useAuth } from '@features/auth/hooks/useAuth'

interface FormValues {
  code: string
}

export const ConfirmForm = ({ email }: { email: string }) => {
  const { confirm, loading, error } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = ({ code }: FormValues) => confirm(email, code)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">
        A verification code was sent to <span className="font-medium text-slate-700">{email}</span>
      </p>
      <Input
        label="Verification code"
        placeholder="123456"
        error={errors.code?.message}
        {...register('code', { required: 'Code is required' })}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">
        Confirm account
      </Button>
    </form>
  )
}
