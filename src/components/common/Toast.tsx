import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/helpers'

/** Global toast container; mount once near the app root. Styled per design tokens. */
export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#16A34A', secondary: '#DCFCE7' },
          style: { background: '#DCFCE7', color: '#14532D' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#FEE2E2' },
          style: { background: '#FEE2E2', color: '#7F1D1D' },
        },
      }}
    />
  )
}

export interface WarningAlertProps {
  message: string
  className?: string
}

/** Inline warning banner (orange), distinct from toast notifications. */
export function WarningAlert({ message, className }: WarningAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-2 rounded-lg bg-accent-50 px-4 py-3 text-body-sm text-accent-700',
        className,
      )}
      role="alert"
    >
      <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-accent-600" />
      <span>{message}</span>
    </motion.div>
  )
}
