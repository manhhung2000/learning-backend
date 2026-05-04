'use client'

import { useEffect, useState } from 'react'
import { classesApi } from '@lib/api/classes.api'
import { coursesApi } from '@lib/api/courses.api'
import { enrollmentsApi } from '@lib/api/enrollments.api'
import { useAuthStore } from '@store/auth.store'
import { GraduationCap, BookOpen, ClipboardList } from 'lucide-react'

interface Stats {
  classes: number
  courses: number
  enrollments: number
}

const statConfig = [
  {
    key: 'classes' as const,
    label: 'Classes',
    icon: GraduationCap,
    color: 'bg-sky-500',
    light: 'bg-sky-50',
    text: 'text-sky-600',
  },
  {
    key: 'courses' as const,
    label: 'Courses',
    icon: BookOpen,
    color: 'bg-emerald-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    key: 'enrollments' as const,
    label: 'Enrollments',
    icon: ClipboardList,
    color: 'bg-amber-500',
    light: 'bg-amber-50',
    text: 'text-amber-600',
  },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const role = user?.role
  const [stats, setStats] = useState<Stats>({ classes: 0, courses: 0, enrollments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [courses, classes, enrollments] = await Promise.all([
        coursesApi.findAll(1, 1),
        classesApi.findAll(1, 1),
        enrollmentsApi.findAll(1, 1),
      ])
      setStats({ classes: classes.total, courses: courses.total, enrollments: enrollments.total })
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back, <span className="font-medium text-slate-600">{user?.name}</span>
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
          {role}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statConfig.map(({ key, label, icon: Icon, color, light, text }) => (
          <div
            key={key}
            className="stat-card-glow rounded-2xl bg-white border border-slate-100 p-6 shadow-sm"
          >
            <div className={`rounded-xl ${light} p-2.5 w-fit`}>
              <Icon className={`h-5 w-5 ${text}`} />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-800">
                {loading ? (
                  <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
                ) : (
                  stats[key].toLocaleString()
                )}
              </p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </div>
            <div className={`mt-4 h-1 rounded-full ${color} opacity-20`} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Quick Links
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: '/classes', label: 'View Classes', icon: GraduationCap },
            { href: '/courses', label: 'View Courses', icon: BookOpen },
            { href: '/enrollments', label: 'Enrollments', icon: ClipboardList },
          ].map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
