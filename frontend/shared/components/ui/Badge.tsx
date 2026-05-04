import { cn } from '@shared/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-slate-100 text-slate-600': variant === 'default',
          'bg-emerald-50 text-emerald-700 border border-emerald-100': variant === 'success',
          'bg-amber-50 text-amber-700 border border-amber-100': variant === 'warning',
          'bg-red-50 text-red-700 border border-red-100': variant === 'danger',
          'bg-indigo-50 text-indigo-700 border border-indigo-100': variant === 'info',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
