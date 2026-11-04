import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

export interface TooltipProps {
  /** Texto de ayuda que se muestra al pasar el cursor o enfocar. */
  label: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const positionClasses: Record<NonNullable<TooltipProps['position']>, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
}

/**
 * Tooltip accesible basado en CSS (hover + focus). Envuelve cualquier elemento
 * y muestra `label` como ayuda contextual, sin dependencias externas.
 */
export function Tooltip({
  label,
  children,
  position = 'top',
  className,
}: TooltipProps) {
  return (
    <span className={cn('group/tooltip relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 w-max max-w-xs rounded-lg border border-white/10 bg-surface-elevated px-3 py-1.5 text-caption font-medium text-text-primary opacity-0 shadow-xl shadow-black/40 transition-opacity duration-150',
          'group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100',
          positionClasses[position],
        )}
      >
        {label}
      </span>
    </span>
  )
}
