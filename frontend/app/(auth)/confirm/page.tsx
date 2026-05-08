'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ConfirmForm } from '@features/auth/components/ConfirmForm'
import { BookOpen } from 'lucide-react'

const ConfirmContent = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-2xl shadow-emerald-500/30 mb-6">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white text-center">Check your inbox</h2>
        <p className="mt-3 text-slate-400 text-center max-w-xs">
          Enter the verification code we sent to confirm your account.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">LearningApp</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
          <p className="mt-1.5 text-sm text-slate-400 mb-8">Enter the 6-digit code from your email</p>
          <ConfirmForm email={email} />
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  )
}
