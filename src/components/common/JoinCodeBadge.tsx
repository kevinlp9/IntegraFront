import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface JoinCodeBadgeProps {
  code: string
  size?: 'md' | 'lg'
  className?: string
}

/** Displays a room's join code in large monospaced type, with a copy-to-clipboard action. */
export function JoinCodeBadge({ code, size = 'lg', className }: JoinCodeBadgeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'group inline-flex items-center gap-3 rounded-2xl border border-primary-500/30 bg-primary-500/10 px-6 py-3 font-display font-bold tracking-widest text-primary-200 transition hover:bg-primary-500/20',
        size === 'lg' ? 'text-h2' : 'text-h3',
        className,
      )}
    >
      {code}
      {copied ? (
        <Check className="h-6 w-6 text-accent-green" />
      ) : (
        <Copy className="h-6 w-6 text-primary-300 group-hover:text-primary-100" />
      )}
    </button>
  )
}
