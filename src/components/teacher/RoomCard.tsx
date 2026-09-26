import { Link } from 'react-router-dom'
import { UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/common/Card'
import type { Room } from '@/types'

export interface RoomCardProps {
  room: Room
}

const statusStyles: Record<Room['status'], string> = {
  active: 'bg-secondary-100 text-secondary-700',
  draft: 'bg-gray-100 text-gray-600',
  closed: 'bg-red-100 text-red-700',
}

const statusLabels: Record<Room['status'], string> = {
  active: 'ACTIVA',
  draft: 'BORRADOR',
  closed: 'CERRADA',
}

/** Summary card for a teacher's room, linking to detail and reports. */
export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card hoverable className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-h3 text-gray-900 dark:text-gray-50">
            {room.name}
          </h3>
          <p className="text-body-sm text-gray-500">
            Código: <span className="font-mono font-semibold">{room.joinCode}</span>
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-caption font-semibold ${statusStyles[room.status]}`}
        >
          {statusLabels[room.status]}
        </span>
      </div>

      {room.description && (
        <p className="text-body-sm text-gray-600 dark:text-gray-400">
          {room.description}
        </p>
      )}

      <div className="flex items-center gap-1 text-body-sm text-gray-500">
        <UsersIcon className="h-4 w-4" />
        {room.studentsCount ?? 0} estudiantes
      </div>

      <div className="mt-2 flex gap-2">
        <Link
          to={`/teacher/rooms/${room.id}`}
          className="btn flex-1 border border-primary-700 bg-transparent px-3 py-2 text-body-sm text-primary-700 hover:bg-primary-50"
        >
          Editar
        </Link>
        <Link
          to={`/teacher/rooms/${room.id}/reports`}
          className="btn flex-1 gap-1 bg-primary-700 px-3 py-2 text-body-sm text-white hover:bg-primary-600"
        >
          <ChartBarIcon className="h-4 w-4" />
          Reportes
        </Link>
      </div>
    </Card>
  )
}
