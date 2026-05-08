'use client'

import { useState } from 'react'
import { signIn, signUp, confirmSignIn, confirmSignUp } from 'aws-amplify/auth'
import { authStore } from '@store/auth.store'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requiresNewPassword, setRequiresNewPassword] = useState(false)

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
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
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
      const username = crypto.randomUUID()
      const { nextStep } = await signUp({
        username,
        password: payload.password,
        options: { userAttributes: { email: payload.email, name: payload.name } },
      })
      sessionStorage.setItem('pendingUsername', username)
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        window.location.href = `/confirm?email=${encodeURIComponent(payload.email)}`
      } else {
        window.location.href = '/login?registered=1'
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err.name === 'UsernameExistsException' || err.name === 'AliasExistsException')
      ) {
        setError('An account with this email already exists.')
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
      const username = sessionStorage.getItem('pendingUsername') ?? email
      await confirmSignUp({ username, confirmationCode: code })
      sessionStorage.removeItem('pendingUsername')
      window.location.href = '/login?registered=1'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Confirmation failed')
    } finally {
      setLoading(false)
    }
  }

  return { login, submitNewPassword, register, confirm, loading, error, requiresNewPassword }
}
