'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@store/auth.store'
import { LoginForm } from '@features/auth/components/LoginForm'
import { BookOpen } from 'lucide-react'

export default function LoginPage() {
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
        <h2 className="text-3xl font-bold text-white text-center">LearningApp</h2>
        <p className="mt-3 text-slate-400 text-center max-w-xs">
          Manage your courses, classes, and students in one place.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {['Courses', 'Classes', 'Students', 'Enrollments'].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-300"
            >
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
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-400 mb-8">Sign in to your account to continue</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
