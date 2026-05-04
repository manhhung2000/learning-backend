'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@store/auth.store'
import type { UserRole } from '@models/api.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, initialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) router.replace('/')
  }, [initialized, user, allowedRoles, router])

  if (!initialized || !user) return null
  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) return null

  return <>{children}</>
}
