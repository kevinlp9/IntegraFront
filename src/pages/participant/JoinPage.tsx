import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, DoorOpen, LogOut, Rocket } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
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

  // Modal de validación (salas de grupo): confirmar nombre + contraseña.
  const [pendingCode, setPendingCode] = useState<string | null>(null)
  const [confirmName, setConfirmName] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [accessPassword, setAccessPassword] = useState('')
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const {
    data: myRooms,
    isLoading: loadingRooms,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ['alumno-rooms', alumno?.boleta],
    queryFn: () => evaluationService.listMyRooms(),
    enabled: !!alumno,
  })

  // Grupos a los que pertenece el alumno (para ofrecer "Mi historial").
  const grupoIds = useMemo(() => {
    const ids = new Set<number>()
    for (const room of myRooms ?? []) {
      if (room.grupo_id !== null) ids.add(room.grupo_id)
    }
    return [...ids]
  }, [myRooms])

  const enterRoom = (code: string) => {
    setParticipant(code, alumno?.nombre ?? '')
    navigate(`/play/${code}`)
  }

  const openConfirm = (code: string) => {
    setPendingCode(code)
    setConfirmName(alumno?.nombre ?? '')
    setAccessPassword('')
    setConfirmError(null)
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
      // La sala puede pertenecer a un grupo: pedir nombre + contraseña.
      openConfirm(formattedCode)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!pendingCode) return
    if (!confirmName.trim() || !accessPassword || !confirmEmail.trim()) {
      setConfirmError('Completa tu nombre, correo y la contraseña de tu cuenta.')
      return
    }
    setIsConfirming(true)
    setConfirmError(null)
    try {
      await evaluationService.enroll(pendingCode, {
        nombre: confirmName.trim(),
        password: accessPassword,
        email: confirmEmail.trim(),
      })
      void refetchRooms()
      notify.success('¡Te uniste a la sala!')
      const code = pendingCode
      setPendingCode(null)
      enterRoom(code)
    } catch (err) {
      setConfirmError(
        err instanceof Error
          ? err.message
          : 'No se pudo validar tu acceso. Revisa los datos.',
      )
    } finally {
      setIsConfirming(false)
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

      {grupoIds.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-text-secondary">
            Mis grupos
          </h2>
          <ul className="space-y-2">
            {grupoIds.map((id) => (
              <li key={id}>
                <Link
                  to={`/grupos/${id}/historial`}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                >
                  <span className="font-medium text-text-primary">
                    Ver mi historial y retroalimentación
                  </span>
                  <BookOpen className="h-5 w-5 shrink-0 text-primary-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

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

      <Modal
        isOpen={pendingCode !== null}
        onClose={() => setPendingCode(null)}
        title="Confirma tu identidad"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body-sm text-text-secondary">
            Esta sala pertenece a un grupo. Confirma tu nombre completo (debe
            coincidir con la lista del profe), tu correo y firma con la
            contraseña de tu propia cuenta. Así queda registrado quién usa esta
            cuenta y el profe puede validarlo.
          </p>
          <Input
            label="Nombre completo"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
          />
          <Input
            label="Correo de tu cuenta"
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
          <Input
            label="Contraseña de tu cuenta"
            type="password"
            value={accessPassword}
            onChange={(e) => setAccessPassword(e.target.value)}
            error={confirmError ?? undefined}
          />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setPendingCode(null)}>
              Cancelar
            </Button>
            <Button fullWidth isLoading={isConfirming} onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </AuthLayout>
  )
}
