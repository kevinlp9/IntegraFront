import { QRCodeSVG } from 'qrcode.react'
import { Card } from '@/components/common/Card'
import { JoinCodeBadge } from '@/components/common/JoinCodeBadge'

export interface QRCodeCardProps {
  joinCode: string
}

/** Displays the room's join code plus a scannable QR pointing to /join/{code}. */
export function QRCodeCard({ joinCode }: QRCodeCardProps) {
  const joinUrl = `${window.location.origin}/join/${joinCode}`

  return (
    <Card variant="elevated" className="flex flex-col items-center gap-4 text-center">
      <p className="text-body-sm text-text-secondary">
        Comparte este código o escanea el QR
      </p>
      <JoinCodeBadge code={joinCode} />
      <div className="rounded-2xl bg-white p-4">
        <QRCodeSVG value={joinUrl} size={160} />
      </div>
    </Card>
  )
}
