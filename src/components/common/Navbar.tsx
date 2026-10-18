import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'
import { Logo } from './Logo'

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
        'sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-surface/80 px-4 shadow-lg shadow-black/10 backdrop-blur-md sm:px-6',
        className,
      )}
    >
      <div className="flex items-center gap-2">{logo ?? <Logo />}</div>
      <div className="flex items-center gap-3">{children}</div>
    </nav>
  )
}
