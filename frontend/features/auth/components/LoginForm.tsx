'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@shared/components/ui/Input'
import { Button } from '@shared/components/ui/Button'
import { useAuth } from '@features/auth/hooks/useAuth'
import Link from 'next/link'

interface LoginValues {
  email: string
  password: string
}
interface NewPasswordValues {
  newPassword: string
  confirmPassword: string
}

export const LoginForm = () => {
  const { login, submitNewPassword, loading, error, requiresNewPassword } = useAuth()
  const loginForm = useForm<LoginValues>()
  const newPasswordForm = useForm<NewPasswordValues>()

  if (requiresNewPassword) {
    const onSubmit = (data: NewPasswordValues) => {
      if (data.newPassword !== data.confirmPassword) {
        newPasswordForm.setError('confirmPassword', { message: 'Passwords do not match' })
        return
      }
      submitNewPassword(data.newPassword)
    }
    return (
      <form onSubmit={newPasswordForm.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-slate-600">
          Your account requires a new password before signing in.
        </p>
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          error={newPasswordForm.formState.errors.newPassword?.message}
          {...newPasswordForm.register('newPassword', {
            required: 'New password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
          })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={newPasswordForm.formState.errors.confirmPassword?.message}
          {...newPasswordForm.register('confirmPassword', {
            required: 'Please confirm your password',
          })}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Set New Password
        </Button>
      </form>
    )
  }

  return (
    <form
      onSubmit={loginForm.handleSubmit((d) => login(d.email, d.password))}
      className="flex flex-col gap-4"
    >
      <Input
        label="Email"
        type="email"
        placeholder="email@example.com"
        error={loginForm.formState.errors.email?.message}
        {...loginForm.register('email', { required: 'Email is required' })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={loginForm.formState.errors.password?.message}
        {...loginForm.register('password', { required: 'Password is required' })}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-emerald-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
