import { cn } from '@/utils/helpers'

export interface AmbientBackgroundProps {
  className?: string
}

/**
 * Fixed, decorative gradient blobs + dotted grid used behind page content to
 * give every screen the same branded, elegant depth without extra markup per
 * page. Purely visual: `pointer-events-none` and `aria-hidden`.
 */
export function AmbientBackground({ className }: AmbientBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}
    >
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-32 left-1/4 h-96 w-96 animate-drift rounded-full bg-primary-600/20 blur-3xl" />
      <div
        className="absolute -bottom-32 right-1/4 h-96 w-96 animate-drift rounded-full bg-accent-blue/15 blur-3xl"
        style={{ animationDelay: '-7s' }}
      />
    </div>
  )
}
