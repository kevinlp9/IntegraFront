import { cn } from '@/utils/helpers'
import type { RoomStatus } from '@/types'

export interface RoomStatusBadgeProps {
  status: RoomStatus
  className?: string
}

const statusStyles: Record<RoomStatus, string> = {
  waiting: 'bg-white/10 text-text-secondary',
  active: 'bg-accent-green/15 text-accent-green',
  finished: 'bg-primary-500/15 text-primary-300',
}

const dotStyles: Record<RoomStatus, string> = {
  waiting: 'bg-text-secondary',
  active: 'bg-accent-green animate-pulseGlow',
  finished: 'bg-primary-400',
}

const statusLabels: Record<RoomStatus, string> = {
  waiting: 'EN ESPERA',
  active: 'ACTIVA',
  finished: 'FINALIZADA',
}

/** Pill badge showing the room's current lifecycle status. */
export function RoomStatusBadge({ status, className }: RoomStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-bold tracking-wide',
        statusStyles[status],
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[status])} />
      {statusLabels[status]}
    </span>
  )
}
