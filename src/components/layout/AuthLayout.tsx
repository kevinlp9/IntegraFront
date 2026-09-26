import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

/** Centered card layout used by Login/Signup pages. */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 dark:from-primary-900 dark:via-gray-900 dark:to-primary-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
      >
        <div className="mb-8 text-center">
          <h1 className="text-h3 text-primary-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-body-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  )
}
