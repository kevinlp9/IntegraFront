import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/helpers'

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'outlined' | 'filled'
  hoverable?: boolean
  children: ReactNode
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  elevated: 'bg-white shadow-lg shadow-gray-200/50 dark:bg-gray-800',
  outlined: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  filled: 'bg-gray-50 dark:bg-gray-700/50',
}

/** Generic surface container with elevated/outlined/filled styles. */
export function Card({
  variant = 'elevated',
  hoverable = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn('rounded-2xl p-6', variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
