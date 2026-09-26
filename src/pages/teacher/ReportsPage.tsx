import { useParams } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ReportDashboard } from '@/components/teacher/ReportDashboard'
import { useRoom } from '@/hooks/useRoom'

/** Teacher reports page: wraps ReportDashboard with the room context. */
export default function ReportsPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const { room } = useRoom(roomId)

  if (!roomId || !room) return null

  return (
    <MainLayout>
      <ReportDashboard roomId={roomId} roomCode={room.joinCode} />
    </MainLayout>
  )
}
