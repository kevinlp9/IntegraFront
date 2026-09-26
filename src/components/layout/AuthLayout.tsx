import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

/** Centered glass card layout used by Login and Join pages, over a gradient hero background. */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-20 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card relative w-full max-w-md p-8 shadow-2xl shadow-primary-900/40"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-h3 font-bold text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-body-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  )
}
