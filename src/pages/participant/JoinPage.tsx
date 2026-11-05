import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  DoorOpen,
  LogOut,
  Rocket,
  Settings,
  Users,
} from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { evaluationService } from '@/services/evaluation.service'
import { grupoService } from '@/services/grupo.service'
import { useParticipantStore } from '@/store/participantStore'
import { useAlumnoAuth } from '@/hooks/useAlumnoAuth'
import { useNotification } from '@/hooks/useNotification'
import { isValidJoinCode } from '@/utils/validators'
import { formatJoinCode } from '@/utils/formatters'
import type { AlumnoRoomSummary, ClaimStatus, RoomStatus } from '@/types'

const STATUS_LABEL: Record<RoomStatus, string> = {
  waiting: 'En espera',
  active: 'En vivo',
  finished: 'Finalizada',
}

const CLAIM_LABEL: Record<ClaimStatus, string> = {
  pending: 'Pendiente de validar',
  approved: 'Validado por el profe',
  rejected: 'Acceso rechazado',
}

type Pending = { type: 'room' | 'grupo'; code: string }

/** Join page del alumno: entrar a salas y grupos por código, con validación. */
export default function JoinPage() {
  const navigate = useNavigate()
  const notify = useNotification()
  const { code: codeFromUrl } = useParams<{ code?: string }>()
  const setParticipant = useParticipantStore((s) => s.setParticipant)
  const { alumno, logout } = useAlumnoAuth()

  const [joinCode, setJoinCode] = useState(codeFromUrl ?? '')
  const [grupoCode, setGrupoCode] = useState('')
  const [errors, setErrors] = useState<{ code?: string; grupo?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  // Modal de validación (sala de grupo o grupo): confirmar identidad.
  const [pending, setPending] = useState<Pending | null>(null)
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

  const {
    data: myGrupos,
    isLoading: loadingGrupos,
    refetch: refetchGrupos,
  } = useQuery({
    queryKey: ['alumno-grupos', alumno?.boleta],
    queryFn: () => grupoService.listMyGrupos(),
    enabled: !!alumno,
  })

  const enterRoom = (code: string) => {
    setParticipant(code, alumno?.nombre ?? '')
    navigate(`/play/${code}`)
  }

  const openConfirm = (next: Pending) => {
    setPending(next)
    setConfirmName(alumno?.nombre ?? '')
    setConfirmEmail(alumno?.email ?? '')
    setAccessPassword('')
    setConfirmError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!isValidJoinCode(joinCode)) nextErrors.code = 'Código inválido.'
    setErrors(nextErrors)
    if (nextErrors.code) return

    const formattedCode = formatJoinCode(joinCode)
    setIsLoading(true)
    try {
      await evaluationService.enroll(formattedCode)
      void refetchRooms()
      notify.success('¡Te uniste a la sala!')
      enterRoom(formattedCode)
    } catch {
      // La sala puede pertenecer a un grupo: pedir identidad.
      openConfirm({ type: 'room', code: formattedCode })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGrupoSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!isValidJoinCode(grupoCode)) nextErrors.grupo = 'Código inválido.'
    setErrors(nextErrors)
    if (nextErrors.grupo) return
    // Unirse a un grupo siempre requiere validar identidad contra la lista.
    openConfirm({ type: 'grupo', code: formatJoinCode(grupoCode) })
  }

  const handleConfirm = async () => {
    if (!pending) return
    if (!confirmName.trim() || !accessPassword || !confirmEmail.trim()) {
      setConfirmError('Completa tu nombre, correo y la contraseña de tu cuenta.')
      return
    }
    setIsConfirming(true)
    setConfirmError(null)
    const credentials = {
      nombre: confirmName.trim(),
      password: accessPassword,
      email: confirmEmail.trim(),
    }
    try {
      if (pending.type === 'room') {
        await evaluationService.enroll(pending.code, credentials)
        void refetchRooms()
        void refetchGrupos()
        notify.success('¡Te uniste a la sala!')
        const code = pending.code
        setPending(null)
        enterRoom(code)
      } else {
        const grupo = await grupoService.joinByCode(pending.code, credentials)
        void refetchGrupos()
        notify.success(`¡Te uniste al grupo ${grupo.name}!`)
        setPending(null)
        navigate(`/grupos/${grupo.id}/historial`)
      }
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
      title="📚 Salas y Grupos"
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

      <form onSubmit={handleGrupoSubmit} className="mt-4 space-y-4">
        <Input
          label="Código de Grupo"
          placeholder="Ej: CLASS-2B7D"
          value={grupoCode}
          onChange={(e) => setGrupoCode(e.target.value)}
          error={errors.grupo}
          helperText="Únete a la clase del semestre para ver tu historial y acumulado."
          className="text-center font-display text-h3 tracking-widest"
        />
        <Button type="submit" variant="secondary" fullWidth size="lg">
          <Users className="h-5 w-5" />
          Entrar a Grupo
        </Button>
      </form>

      {/* Mis grupos: clases a las que el alumno ya se unió */}
      <div className="mt-8">
        <h2 className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-text-secondary">
          Mis grupos
        </h2>
        {loadingGrupos ? (
          <p className="text-body-sm text-text-secondary">Cargando…</p>
        ) : myGrupos && myGrupos.length > 0 ? (
          <ul className="space-y-2">
            {myGrupos.map((grupo) => (
              <li key={grupo.id}>
                <Link
                  to={`/grupos/${grupo.id}/historial`}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-text-primary">
                      {grupo.name}
                    </span>
                    <span className="block text-caption text-text-secondary">
                      {grupo.semester ? `${grupo.semester} · ` : ''}
                      {grupo.claim_status
                        ? CLAIM_LABEL[grupo.claim_status]
                        : ''}
                    </span>
                  </span>
                  <BookOpen className="h-5 w-5 shrink-0 text-primary-300" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm text-text-secondary">
            Aún no te has unido a ningún grupo. Ingresa el código de tu clase.
          </p>
        )}
      </div>

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

      <div className="mt-6 flex items-center justify-center gap-4 text-body-sm">
        <Link
          to="/mi-cuenta"
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
        >
          <Settings className="h-4 w-4" />
          Mi cuenta
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>

      <Modal
        isOpen={pending !== null}
        onClose={() => setPending(null)}
        title="Confirma tu identidad"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body-sm text-text-secondary">
            {pending?.type === 'grupo'
              ? 'Para unirte al grupo'
              : 'Esta sala pertenece a un grupo'}
            . Confirma tu nombre completo (debe coincidir con la lista del
            profe), tu correo y firma con la contraseña de tu propia cuenta.
            Así queda registrado quién usa esta cuenta y el profe puede
            validarlo.
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
            <Button variant="secondary" fullWidth onClick={() => setPending(null)}>
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
