import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/** Accessible modal dialog, full-screen on mobile per the design spec. */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className={`h-full w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface-elevated p-6 shadow-2xl sm:h-auto sm:rounded-3xl ${sizeClasses[size]}`}
          >
            <div className="mb-4 flex items-center justify-between">
              {title && (
                <h3 className="text-h3 text-text-primary">{title}</h3>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="ml-auto rounded-full p-1 text-text-secondary hover:bg-white/10 hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
