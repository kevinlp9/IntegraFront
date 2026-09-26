import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/helpers'

/** Global toast container; mount once near the app root. Styled per design tokens. */
export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '14px',
          background: '#1E2740',
          color: '#F8FAFC',
          border: '1px solid rgba(255,255,255,0.08)',
        },
        success: {
          iconTheme: { primary: '#10B981', secondary: '#1E2740' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#1E2740' },
        },
      }}
    />
  )
}

export interface WarningAlertProps {
  message: string
  className?: string
}

/** Inline warning banner (amber), distinct from toast notifications. */
export function WarningAlert({ message, className }: WarningAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-2 rounded-xl border border-accent-amber/30 bg-accent-amber/10 px-4 py-3 text-body-sm text-accent-amber',
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <span>{message}</span>
    </motion.div>
  )
}
