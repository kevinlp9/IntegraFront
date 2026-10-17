import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DoorOpen, LogOut, Rocket } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { evaluationService } from '@/services/evaluation.service'
import { useParticipantStore } from '@/store/participantStore'
import { useAlumnoAuth } from '@/hooks/useAlumnoAuth'
import { useNotification } from '@/hooks/useNotification'
import { isValidJoinCode } from '@/utils/validators'
import { formatJoinCode } from '@/utils/formatters'
import type { AlumnoRoomSummary, RoomStatus } from '@/types'

const STATUS_LABEL: Record<RoomStatus, string> = {
  waiting: 'En espera',
  active: 'En vivo',
  finished: 'Finalizada',
}

/** Join page del alumno autenticado: código de sala + lista de "Mis salas". */
export default function JoinPage() {
  const navigate = useNavigate()
  const notify = useNotification()
  const { code: codeFromUrl } = useParams<{ code?: string }>()
  const setParticipant = useParticipantStore((s) => s.setParticipant)
  const { alumno, logout } = useAlumnoAuth()

  const [joinCode, setJoinCode] = useState(codeFromUrl ?? '')
  const [errors, setErrors] = useState<{ code?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: myRooms,
    isLoading: loadingRooms,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ['alumno-rooms', alumno?.boleta],
    queryFn: () => evaluationService.listMyRooms(),
    enabled: !!alumno,
  })

  const enterRoom = (code: string) => {
    setParticipant(code, alumno?.nombre ?? '')
    navigate(`/play/${code}`)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!isValidJoinCode(joinCode)) nextErrors.code = 'Código inválido.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const formattedCode = formatJoinCode(joinCode)
    setIsLoading(true)
    try {
      await evaluationService.enroll(formattedCode)
      void refetchRooms()
      notify.success('¡Te uniste a la sala!')
      enterRoom(formattedCode)
    } catch {
      notify.error('Código de sala inválido o sala no encontrada.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="📚 Unirse a Sala"
      subtitle={alumno ? `Hola, ${alumno.nombre} (${alumno.boleta})` : 'Evaluaciones en vivo'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Código de Sala"
          placeholder="Ej: ROOM-9F3A"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          error={errors.code}
          className="text-center font-display text-h3 tracking-widest"
        />
        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          <Rocket className="h-5 w-5" />
          Entrar a Sala
        </Button>
      </form>

      {/* Mis salas: solo las salas a las que el alumno ya se unió */}
      <div className="mt-8">
        <h2 className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-text-secondary">
          Mis salas
        </h2>

        {loadingRooms ? (
          <p className="text-body-sm text-text-secondary">Cargando…</p>
        ) : myRooms && myRooms.length > 0 ? (
          <ul className="space-y-2">
            {myRooms.map((room: AlumnoRoomSummary) => (
              <li key={room.room_id}>
                <button
                  type="button"
                  onClick={() => enterRoom(room.join_code)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-text-primary">
                      {room.name}
                    </span>
                    <span className="block text-caption text-text-secondary">
                      {room.join_code} · {STATUS_LABEL[room.status]}
                    </span>
                  </span>
                  <DoorOpen className="h-5 w-5 shrink-0 text-primary-300" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm text-text-secondary">
            Aún no te has unido a ninguna sala. Ingresa un código para empezar.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 flex w-full items-center justify-center gap-1.5 text-body-sm text-text-secondary hover:text-text-primary"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </AuthLayout>
  )
}
