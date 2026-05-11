'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@shared/components/ui/Input'
import { Button } from '@shared/components/ui/Button'
import { useAuth } from '@features/auth/hooks/useAuth'
import Link from 'next/link'

interface FormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const RegisterForm = () => {
  const { register: registerUser, loading, error } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = ({ name, email, password }: FormValues) =>
    registerUser({ name, email, password })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      <Input
        label="Email"
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Minimum 8 characters' },
        })}
      />
      <Input
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (val) => val === watch('password') || 'Passwords do not match',
        })}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">
        Sign up
      </Button>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}
