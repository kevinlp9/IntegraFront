import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input, Select } from '@/components/common/Input'
import { Tooltip } from '@/components/common/Tooltip'
import { RoomStatusBadge } from '@/components/common/RoomStatusBadge'
import { RosterPanel } from '@/components/teacher/RosterPanel'
import { AccumulatedTable } from '@/components/teacher/AccumulatedTable'
import { FormulaEditor } from '@/components/teacher/FormulaEditor'
import { useGrupo } from '@/hooks/useGrupo'
import { cn } from '@/utils/helpers'
import {
  MODE_LABELS,
  PERIOD_LABELS,
  type GradeFormula,
  type Period,
  type RoomMode,
} from '@/types'

type Tab = 'events' | 'roster' | 'accumulated' | 'config'

const PERIOD_OPTIONS = (Object.keys(PERIOD_LABELS) as Period[]).map((p) => ({
  value: p,
  label: PERIOD_LABELS[p],
}))
const MODE_OPTIONS = (Object.keys(MODE_LABELS) as RoomMode[]).map((m) => ({
  value: m,
  label: MODE_LABELS[m],
}))

/** Centro de control de un Grupo: eventos, alumnos, acumulado y configuración. */
export default function GrupoDetailPage() {
  const { grupoId } = useParams<{ grupoId: string }>()
  const numericId = grupoId ? Number(grupoId) : undefined
  const {
    grupo,
    rooms,
    roster,
    accumulated,
    isLoading,
    createRoom,
    isCreatingRoom,
    setRoster,
    isSavingRoster,
    setProfeGrade,
    reviewClaim,
    isReviewingClaim,
    updateGrupo,
    isUpdating,
  } = useGrupo(numericId)

  const [tab, setTab] = useState<Tab>('events')
  const [isRoomModalOpen, setRoomModalOpen] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [period, setPeriod] = useState<Period>('parcial_1')
  const [mode, setMode] = useState<RoomMode>('team')
  const [formula, setFormula] = useState<GradeFormula | null>(null)

  if (isLoading || !grupo) {
    return (
      <MainLayout>
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      </MainLayout>
    )
  }

  const currentFormula = formula ?? grupo.formula

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return
    await createRoom({ name: roomName.trim(), period, mode })
    setRoomName('')
    setRoomModalOpen(false)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'events', label: 'Eventos' },
    { id: 'roster', label: 'Alumnos' },
    { id: 'accumulated', label: 'Acumulado' },
    { id: 'config', label: 'Configuración' },
  ]

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link to="/grupos">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Mis Grupos
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-h2 text-text-primary">{grupo.name}</h1>
            <p className="text-caption text-text-secondary">
              {grupo.semester ? `Semestre ${grupo.semester} · ` : ''}
              <span className="font-mono text-primary-300">{grupo.join_code}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-body-sm font-semibold transition',
              tab === t.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'events' && (
        <>
          <div className="mb-4 flex justify-end">
            <Tooltip label="Crea un evento (sala) y asígnalo a un parcial. Elige si se evalúa por equipo o individual.">
              <Button onClick={() => setRoomModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Nuevo evento
              </Button>
            </Tooltip>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card key={room.id} hoverable className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-h3 text-text-primary">{room.name}</h3>
                  <RoomStatusBadge status={room.status} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-primary-600/20 px-2 py-0.5 text-caption font-semibold text-primary-200">
                    {PERIOD_LABELS[room.period]}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-caption font-semibold text-text-secondary">
                    {MODE_LABELS[room.mode]}
                  </span>
                </div>
                <p className="font-mono text-body-sm font-semibold text-primary-300">
                  {room.join_code}
                </p>
                <Link to={`/rooms/${room.id}`}>
                  <Button fullWidth variant="secondary">
                    Entrar
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          {rooms.length === 0 && (
            <p className="py-16 text-center text-body text-text-secondary">
              Aún no hay eventos en este grupo. ¡Crea el primer parcial! 🎉
            </p>
          )}
        </>
      )}

      {tab === 'roster' && (
        <RosterPanel
          roster={roster}
          isSaving={isSavingRoster}
          onSave={setRoster}
          onReview={reviewClaim}
          isReviewing={isReviewingClaim}
        />
      )}

      {tab === 'accumulated' &&
        (accumulated ? (
          <AccumulatedTable report={accumulated} onProfeGrade={setProfeGrade} />
        ) : (
          <div className="h-48 animate-pulse rounded-3xl bg-white/5" />
        ))}

      {tab === 'config' && (
        <Card variant="outlined" className="max-w-xl space-y-4">
          <h3 className="text-h3 text-text-primary">Fórmula del promedio final</h3>
          <FormulaEditor value={currentFormula} onChange={setFormula} />
          <Button
            isLoading={isUpdating}
            onClick={async () => {
              await updateGrupo({ formula: currentFormula })
              setFormula(null)
            }}
          >
            Guardar fórmula
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        title="Nuevo evento del grupo"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del evento"
            placeholder="Ej: Examen Parcial 1"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Select
            label="Periodo"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(v) => setPeriod(v as Period)}
          />
          <Select
            label="Modo de evaluación"
            options={MODE_OPTIONS}
            value={mode}
            onChange={(v) => setMode(v as RoomMode)}
            helperText={
              mode === 'individual'
                ? 'Los elementos serán alumnos de la lista oficial.'
                : 'Los elementos serán equipos/rondas.'
            }
          />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setRoomModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              fullWidth
              isLoading={isCreatingRoom}
              onClick={handleCreateRoom}
              disabled={!roomName.trim()}
            >
              Crear
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}
