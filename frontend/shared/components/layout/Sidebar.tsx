'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@shared/utils/cn'
import { useAuthStore } from '@store/auth.store'
import { useUIStore } from '@store/ui.store'
import { LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { href: '/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
  {
    href: '/classes',
    label: 'Classes',
    icon: GraduationCap,
    roles: ['ADMIN', 'TEACHER', 'STUDENT'],
  },
  { href: '/courses', label: 'Courses', icon: BookOpen, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  {
    href: '/enrollments',
    label: 'Enrollments',
    icon: ClipboardList,
    roles: ['ADMIN', 'TEACHER', 'STUDENT'],
  },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { sidebarOpen } = useUIStore()

  const filtered = navItems.filter((item) => user?.role && item.roles.includes(user.role))

  return (
    <aside
      className={cn(
        'flex h-full flex-col sidebar-gradient transition-all duration-200 shadow-xl',
        sidebarOpen ? 'w-60' : 'w-0 overflow-hidden',
      )}
    >
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/30">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-white tracking-wide">LearningApp</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {filtered.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
              )}
            >
              <Icon
                className={cn('h-4 w-4 shrink-0', active ? 'text-emerald-400' : 'text-slate-500')}
              />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 pb-4">
        <div className="rounded-xl bg-white/5 px-3 py-2.5 text-xs text-slate-500">v1.0.0</div>
      </div>
    </aside>
  )
}
