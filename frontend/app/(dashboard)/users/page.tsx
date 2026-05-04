'use client'

import { ProtectedRoute } from '@shared/components/layout/ProtectedRoute'
import { Users } from 'lucide-react'

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Users className="h-7 w-7 text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-700">User management via AWS Cognito</p>
          <p className="text-sm text-slate-400 mt-1">
            Manage users, roles and groups directly in the{' '}
            <a
              href="https://console.aws.amazon.com/cognito"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:underline"
            >
              AWS Cognito Console
            </a>
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
