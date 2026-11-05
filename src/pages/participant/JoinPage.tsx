import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  BookOpen,
  ChevronRight,
  DoorOpen,
  LogOut,
  Rocket,
  UserCog,
  Users,
} from 'lucide-react'
import { AmbientBackground } from '@/components/common/AmbientBackground'
import { Logo } from '@/components/common/Logo'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { RoomStatusBadge } from '@/components/common/RoomStatusBadge'
import { evaluationService } from '@/services/evaluation.service'
import { grupoService } from '@/services/grupo.service'
import { useParticipantStore } from '@/store/participantStore'
import { useAlumnoAuth } from '@/hooks/useAlumnoAuth'
import { useNotification } from '@/hooks/useNotification'
import { isValidJoinCode } from '@/utils/validators'
import { formatJoinCode } from '@/utils/formatters'
import { cn } from '@/utils/helpers'
import type { AlumnoRoomSummary, ClaimStatus } from '@/types'

const CLAIM_STYLES: Record<ClaimStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendiente de validar',
    className: 'bg-accent-amber/15 text-accent-amber',
  },
  approved: {
    label: 'Validado',
    className: 'bg-accent-green/15 text-accent-green',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-accent-red/15 text-accent-red',
  },
}

type Pending = { type: 'room' | 'grupo'; code: string }

/** Home del alumno: dashboard para entrar a salas y grupos con validación. */
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

  const initial = (alumno?.nombre?.trim()?.[0] ?? '?').toUpperCase()

  return (
    <div className="relative min-h-screen bg-background">
      <AmbientBackground />

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/mi-cuenta">
              <Button variant="secondary" size="sm">
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline">Mi cuenta</span>
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-500/15 font-display text-h3 font-bold text-primary-200">
            {initial}
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-h2 text-text-primary">
              Hola, {alumno?.nombre ?? 'alumno'}
            </h1>
            {alumno && (
              <p className="text-body-sm text-text-secondary">
                Boleta {alumno.boleta} · {alumno.email}
              </p>
            )}
          </div>
        </motion.div>

        {/* Join cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card variant="outlined">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
                <Rocket className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-h3 text-text-primary">Entrar a una sala</h2>
                <p className="text-caption text-text-secondary">
                  Evaluación en vivo del momento.
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Código de sala"
                placeholder="Ej: ROOM-9F3A"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                error={errors.code}
                className="font-display tracking-widest"
              />
              <Button type="submit" fullWidth isLoading={isLoading}>
                <Rocket className="h-4 w-4" />
                Entrar a sala
              </Button>
            </form>
          </Card>

          <Card variant="outlined">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-green/15 text-accent-green">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-h3 text-text-primary">Entrar a un grupo</h2>
                <p className="text-caption text-text-secondary">
                  Tu clase del semestre y su historial.
                </p>
              </div>
            </div>
            <form onSubmit={handleGrupoSubmit} className="space-y-3">
              <Input
                label="Código de grupo"
                placeholder="Ej: CLASS-2B7D"
                value={grupoCode}
                onChange={(e) => setGrupoCode(e.target.value)}
                error={errors.grupo}
                className="font-display tracking-widest"
              />
              <Button type="submit" variant="secondary" fullWidth>
                <Users className="h-4 w-4" />
                Entrar a grupo
              </Button>
            </form>
          </Card>
        </div>

        {/* Mis grupos */}
        <section className="mt-10">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary-300" />
            <h2 className="text-body-sm font-semibold uppercase tracking-wide text-text-secondary">
              Mis grupos
            </h2>
          </div>

          {loadingGrupos ? (
            <SkeletonList />
          ) : myGrupos && myGrupos.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {myGrupos.map((grupo) => {
                const claim = grupo.claim_status
                  ? CLAIM_STYLES[grupo.claim_status]
                  : null
                return (
                  <Link key={grupo.id} to={`/grupos/${grupo.id}/historial`}>
                    <Card
                      variant="outlined"
                      hoverable
                      className="flex h-full items-center gap-4 !p-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-text-primary">
                          {grupo.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {grupo.semester && (
                            <span className="text-caption text-text-secondary">
                              {grupo.semester}
                            </span>
                          )}
                          {claim && (
                            <span
                              className={cn(
                                'inline-flex rounded-full px-2 py-0.5 text-caption font-semibold',
                                claim.className,
                              )}
                            >
                              {claim.label}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              text="Aún no te has unido a ningún grupo. Ingresa el código de tu clase arriba."
            />
          )}
        </section>

        {/* Mis salas */}
        <section className="mt-10">
          <div className="mb-3 flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-primary-300" />
            <h2 className="text-body-sm font-semibold uppercase tracking-wide text-text-secondary">
              Mis salas
            </h2>
          </div>

          {loadingRooms ? (
            <SkeletonList />
          ) : myRooms && myRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {myRooms.map((room: AlumnoRoomSummary) => (
                <button
                  key={room.room_id}
                  type="button"
                  onClick={() => enterRoom(room.join_code)}
                  className="text-left"
                >
                  <Card
                    variant="outlined"
                    hoverable
                    className="flex h-full items-center gap-4 !p-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-green/15 text-accent-green">
                      <DoorOpen className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-text-primary">
                        {room.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-caption text-text-secondary">
                          {room.join_code}
                        </span>
                        <RoomStatusBadge status={room.status} />
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
                  </Card>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Rocket className="h-6 w-6" />}
              text="Aún no te has unido a ninguna sala. Ingresa un código para empezar."
            />
          )}
        </section>
      </main>

      <Modal
        isOpen={pending !== null}
        onClose={() => setPending(null)}
        title="Confirma tu identidad"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body-sm text-text-secondary">
            {pending?.type === 'grupo'
              ? 'Para unirte al grupo, confirma'
              : 'Esta sala pertenece a un grupo. Confirma'}{' '}
            tu nombre completo (debe coincidir con la lista del profe), tu correo
            y firma con la contraseña de tu propia cuenta. Así queda registrado
            quién usa esta cuenta y el profe puede validarlo.
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
    </div>
  )
}

/** Placeholder de carga para las listas. */
function SkeletonList() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-[76px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
        />
      ))}
    </div>
  )
}

/** Estado vacío con icono y mensaje. */
function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/15 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-text-secondary">
        {icon}
      </span>
      <p className="max-w-sm text-body-sm text-text-secondary">{text}</p>
    </div>
  )
}
