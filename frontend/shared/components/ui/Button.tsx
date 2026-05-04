import { cn } from '@shared/utils/cn'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200 active:bg-emerald-700':
            variant === 'primary',
          'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 active:bg-slate-100':
            variant === 'secondary',
          'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 active:bg-red-200':
            variant === 'danger',
          'text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200':
            variant === 'ghost',
          'px-2.5 py-1.5 text-xs gap-1': size === 'sm',
          'px-4 py-2 text-sm gap-1.5': size === 'md',
          'px-6 py-3 text-base gap-2': size === 'lg',
        },
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  )
}
