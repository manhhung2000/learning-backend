'use client'

import { useState } from 'react'
import { signIn, signUp, confirmSignIn, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import { authStore } from '@store/auth.store'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requiresNewPassword, setRequiresNewPassword] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await signIn({ username: email, password })
      if (result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setRequiresNewPassword(true)
        return
      }
      await authStore.init()
      window.location.href = '/'
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'UserNotConfirmedException') {
        await resendSignUpCode({ username: email })
        window.location.href = `/confirm?email=${encodeURIComponent(email)}`
      } else {
        setError(err instanceof Error ? err.message : 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const submitNewPassword = async (newPassword: string) => {
    setLoading(true)
    setError(null)
    try {
      await confirmSignIn({ challengeResponse: newPassword })
      await authStore.init()
      window.location.href = '/'
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to set new password'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: { name: string; email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const { nextStep } = await signUp({
        username: payload.email,
        password: payload.password,
        options: { userAttributes: { email: payload.email, name: payload.name } },
      })
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        sessionStorage.setItem('pendingPassword', payload.password)
        window.location.href = `/confirm?email=${encodeURIComponent(payload.email)}`
      } else {
        window.location.href = '/'
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'UsernameExistsException') {
        // User exists but may be unconfirmed — resend code and redirect to confirm
        await resendSignUpCode({ username: payload.email })
        window.location.href = `/confirm?email=${encodeURIComponent(payload.email)}`
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const confirm = async (email: string, code: string) => {
    setLoading(true)
    setError(null)
    try {
      await confirmSignUp({ username: email, confirmationCode: code })
      const password = sessionStorage.getItem('pendingPassword')
      if (password) {
        sessionStorage.removeItem('pendingPassword')
        await signIn({ username: email, password })
        await authStore.init()
      }
      window.location.href = '/'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Confirmation failed')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async (email: string) => {
    setLoading(true)
    setError(null)
    setResendSuccess(false)
    try {
      await resendSignUpCode({ username: email })
      setResendSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    submitNewPassword,
    register,
    confirm,
    resendCode,
    loading,
    error,
    requiresNewPassword,
    resendSuccess,
  }
}
