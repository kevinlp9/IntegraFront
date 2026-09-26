import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/helpers'
import { Spinner } from './Spinner'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  children: ReactNode
  onClick?: () => void
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-600 focus:ring-primary-300 shadow-sm',
  secondary:
    'border border-primary-700 bg-transparent text-primary-700 hover:bg-primary-50 focus:ring-primary-200 dark:text-primary-300 dark:border-primary-300',
  danger:
    'bg-error text-white hover:bg-red-600 focus:ring-red-300 shadow-sm',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-body-sm',
  md: 'px-4 py-2.5 text-body',
  lg: 'px-6 py-3 text-body-lg',
}

/** Primary UI button supporting variants, sizes and a loading state. */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'btn',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {isLoading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}
