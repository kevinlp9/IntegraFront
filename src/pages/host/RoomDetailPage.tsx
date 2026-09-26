import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChartBar } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/common/Button'
import { RubricsPanel } from '@/components/teacher/RubricsPanel'
import { ExpositionsPanel } from '@/components/teacher/ExpositionsPanel'
import { LiveControlPanel } from '@/components/teacher/LiveControlPanel'
import { QRCodeCard } from '@/components/teacher/QRCodeCard'
import { useRoom } from '@/hooks/useRoom'
import { cn } from '@/utils/helpers'

type Tab = 'questions' | 'elements' | 'live'

/** Host control center for a single room: questions, elements, and live control. */
export default function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const numericId = roomId ? Number(roomId) : undefined
  const {
    room,
    criteria,
    expositions,
    isLoading,
    createRubric,
    createExposition,
    start,
    next,
    activate,
    finish,
    isMutating,
  } = useRoom(numericId)
  const [tab, setTab] = useState<Tab>('live')

  if (isLoading || !room) {
    return (
      <MainLayout>
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      </MainLayout>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'live', label: 'Panel en vivo' },
    { id: 'questions', label: 'Preguntas' },
    { id: 'elements', label: 'Elementos' },
  ]

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="font-display text-h2 text-text-primary">{room.name}</h1>
        <Link to={`/rooms/${room.id}/report`}>
          <Button variant="secondary">
            <ChartBar className="h-4 w-4" />
            Ver Reporte
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex gap-2 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'px-4 py-2.5 text-body-sm font-medium transition',
              tab === t.id
                ? 'border-b-2 border-primary-500 text-text-primary'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'live' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LiveControlPanel
              room={room}
              expositions={expositions}
              onStart={start}
              onNext={next}
              onActivate={activate}
              onFinish={finish}
              isMutating={isMutating}
            />
          </div>
          <QRCodeCard joinCode={room.join_code} />
        </div>
      )}

      {tab === 'questions' && (
        <RubricsPanel criteria={criteria} onCreate={createRubric} />
      )}

      {tab === 'elements' && (
        <ExpositionsPanel
          expositions={expositions}
          currentExpositionId={room.current_exposition_id}
          onCreate={createExposition}
        />
      )}
    </MainLayout>
  )
}
