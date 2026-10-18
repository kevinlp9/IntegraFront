import { Sparkles } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface LogoProps {
  className?: string
  iconOnly?: boolean
}

/** Brand mark: gradient icon badge + wordmark, used in navbars and auth screens. */
export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-hero-gradient shadow-lg shadow-primary-600/40">
        <Sparkles className="h-4 w-4 text-white" />
      </span>
      {!iconOnly && (
        <span className="font-display text-h3 font-bold tracking-tight text-text-primary">
          Integra
        </span>
      )}
    </span>
  )
}
