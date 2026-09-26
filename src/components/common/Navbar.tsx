import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

export interface NavbarProps {
  logo?: ReactNode
  children?: ReactNode
  className?: string
}

/** Top navigation bar shell; content (links, user menu) is passed as children. */
export function Navbar({ logo, children, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        'sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-gray-700 dark:bg-primary-900/80',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {logo ?? (
          <span className="text-h3 font-semibold text-primary-700 dark:text-primary-300">
            Integra
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </nav>
  )
}
