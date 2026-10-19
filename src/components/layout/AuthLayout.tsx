import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { AmbientBackground } from '@/components/common/AmbientBackground'
import { Logo } from '@/components/common/Logo'

export interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

/** Centered glass card layout used by Login and Join pages, over a gradient hero background. */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <AmbientBackground />
      <Link
        to="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-body-sm font-medium text-text-secondary transition hover:bg-white/10 hover:text-text-primary sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Inicio
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card relative w-full max-w-md p-8 shadow-2xl shadow-primary-900/40"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo iconOnly className="mb-4 scale-125" />
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
