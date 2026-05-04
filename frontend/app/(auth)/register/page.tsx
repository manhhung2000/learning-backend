'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@store/auth.store'
import { RegisterForm } from '@features/auth/components/RegisterForm'
import { BookOpen } from 'lucide-react'

export default function RegisterPage() {
  const { user, initialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (initialized && user) router.replace('/')
  }, [initialized, user, router])

  if (!initialized) return null

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-2xl shadow-emerald-500/30 mb-6">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white text-center">Join LearningApp</h2>
        <p className="mt-3 text-slate-400 text-center max-w-xs">
          Create your account and start learning or teaching today.
        </p>
        <div className="mt-12 space-y-3 w-full max-w-xs">
          {['Free to get started', 'Access all courses', 'Track your progress'].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">LearningApp</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1.5 text-sm text-slate-400 mb-8">Fill in your details to get started</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
