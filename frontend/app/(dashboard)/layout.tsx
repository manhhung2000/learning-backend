'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@shared/components/layout/Sidebar'
import { Header } from '@shared/components/layout/Header'
import { useAuthStore } from '@store/auth.store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login')
    }
  }, [initialized, user, router])

  if (!initialized) return null

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 custom-scrollbar">{children}</main>
      </div>
    </div>
  )
}
