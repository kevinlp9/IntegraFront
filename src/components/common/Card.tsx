import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/helpers'

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'outlined' | 'filled'
  hoverable?: boolean
  children: ReactNode
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  elevated: 'glass-card shadow-xl shadow-black/30',
  outlined: 'rounded-3xl border border-white/10 bg-surface',
  filled: 'rounded-3xl bg-surface-elevated',
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
