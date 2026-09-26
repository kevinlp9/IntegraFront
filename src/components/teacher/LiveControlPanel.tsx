import { useState } from 'react'
import { Play, SkipForward, Flag } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { RoomStatusBadge } from '@/components/common/RoomStatusBadge'
import type { Exposition, Room } from '@/types'

export interface LiveControlPanelProps {
  room: Room
  expositions: Exposition[]
  onStart: () => Promise<unknown>
  onNext: () => Promise<unknown>
  onActivate: (expositionId: number) => Promise<unknown>
  onFinish: () => Promise<unknown>
  isMutating: boolean
}

const currentExposition = (room: Room, expositions: Exposition[]) =>
  expositions.find((e) => e.id === room.current_exposition_id) ?? null

/**
 * Host's live-control panel: Start/Next/Finish actions plus manual jump to
 * any exposition, with a confirmation dialog before the destructive Finish action.
 */
export function LiveControlPanel({
  room,
  expositions,
  onStart,
  onNext,
  onActivate,
  onFinish,
  isMutating,
}: LiveControlPanelProps) {
  const [confirmFinish, setConfirmFinish] = useState(false)
  const active = currentExposition(room, expositions)
  const isLast =
    active && expositions.length > 0
      ? active.order >= Math.max(...expositions.map((e) => e.order))
      : false

  return (
    <Card variant="elevated" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 text-text-primary">Panel en vivo</h3>
        <RoomStatusBadge status={room.status} />
      </div>

      {active ? (
        <div className="rounded-2xl bg-primary-500/10 p-4 text-center">
          <p className="text-caption text-primary-300">Elemento activo</p>
          <p className="font-display text-h2 text-text-primary">{active.name}</p>
        </div>
      ) : (
        <p className="rounded-2xl bg-white/5 p-4 text-center text-body-sm text-text-secondary">
          Ningún elemento activo todavía.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button
          onClick={() => void onStart()}
          disabled={room.status !== 'waiting' || expositions.length === 0}
          isLoading={isMutating}
          size="lg"
        >
          <Play className="h-5 w-5" />
          Iniciar
        </Button>
        <Button
          variant="secondary"
          onClick={() => void onNext()}
          disabled={room.status !== 'active' || isLast}
          isLoading={isMutating}
          size="lg"
        >
          <SkipForward className="h-5 w-5" />
          Siguiente
        </Button>
        <Button
          variant="danger"
          onClick={() => setConfirmFinish(true)}
          disabled={room.status === 'finished'}
          size="lg"
        >
          <Flag className="h-5 w-5" />
          Finalizar
        </Button>
      </div>

      {expositions.length > 0 && (
        <div>
          <p className="mb-2 text-body-sm text-text-secondary">
            Saltar manualmente a:
          </p>
          <div className="flex flex-wrap gap-2">
            {expositions.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => void onActivate(exp.id)}
                disabled={exp.id === room.current_exposition_id}
                className={`rounded-full px-3 py-1.5 text-body-sm font-medium transition ${
                  exp.id === room.current_exposition_id
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
                }`}
              >
                {exp.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={confirmFinish}
        onClose={() => setConfirmFinish(false)}
        title="¿Finalizar la sala?"
        size="sm"
      >
        <p className="mb-6 text-body-sm text-text-secondary">
          Esta acción congelará los puntajes finales y no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setConfirmFinish(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={async () => {
              await onFinish()
              setConfirmFinish(false)
            }}
          >
            Sí, finalizar
          </Button>
        </div>
      </Modal>
    </Card>
  )
}
