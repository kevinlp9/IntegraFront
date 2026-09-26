import { Link, useParams } from 'react-router-dom'
import { ChartBarIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import { Spinner } from '@/components/common/Spinner'
import { Button } from '@/components/common/Button'
import { RubricsPanel } from '@/components/teacher/RubricsPanel'
import { ExpositionsPanel } from '@/components/teacher/ExpositionsPanel'
import { useRoom } from '@/hooks/useRoom'
import { useNotification } from '@/hooks/useNotification'

/** Teacher detail page for a room: criteria, teams and quick stats. */
export default function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const {
    room,
    criteria,
    expositions,
    isLoading,
    createRubric,
    deleteRubric,
    createExposition,
    activateTeam,
    deleteExposition,
  } = useRoom(roomId)
  const notify = useNotification()

  if (isLoading || !room) {
    return (
      <MainLayout>
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-primary-600" />
        </div>
      </MainLayout>
    )
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(room.joinCode)
    notify.success('Código copiado al portapapeles.')
  }

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-h2 text-gray-900 dark:text-gray-50">
            {room.name}
          </h1>
          <button
            type="button"
            onClick={copyCode}
            className="mt-1 flex items-center gap-1 text-body-sm text-gray-500 hover:text-primary-600"
          >
            Código: <span className="font-mono font-semibold">{room.joinCode}</span>
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>
        </div>
        <Link to={`/teacher/rooms/${room.id}/reports`}>
          <Button>
            <ChartBarIcon className="h-4 w-4" />
            Ver Reporte
          </Button>
        </Link>
      </div>

      <Card variant="filled" className="mb-6 flex flex-wrap gap-6 text-body-sm text-gray-600 dark:text-gray-300">
        <span>
          Estudiantes: <strong>{room.studentsCount ?? 0}</strong>
        </span>
        <span>
          Criterios: <strong>{criteria.length}</strong>
        </span>
        <span>
          Equipos: <strong>{expositions.length}</strong>
        </span>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RubricsPanel
          criteria={criteria}
          onCreate={createRubric}
          onDelete={deleteRubric}
        />
        <ExpositionsPanel
          expositions={expositions}
          onCreate={createExposition}
          onDelete={deleteExposition}
          onActivate={activateTeam}
        />
      </div>
    </MainLayout>
  )
}
