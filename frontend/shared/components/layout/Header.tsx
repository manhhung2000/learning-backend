'use client'

import { useAuthStore, authStore } from '@store/auth.store'
import { uiStore } from '@store/ui.store'
import { useRouter } from 'next/navigation'
import { formatRole } from '@shared/utils/format'
import { Menu, LogOut } from 'lucide-react'

export const Header = () => {
  const { user } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await authStore.signOut()
    router.push('/login')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <header className="flex h-16 items-center justify-between bg-white border-b border-slate-100 px-5 shadow-sm">
      <button
        onClick={uiStore.toggleSidebar}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-xs text-slate-400">{formatRole(user.role ?? '')}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
          </div>
        )}
        <div className="h-5 w-px bg-slate-200" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
