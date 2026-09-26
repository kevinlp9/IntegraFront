import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { evaluationService } from '@/services/evaluation.service'
import { useParticipantStore } from '@/store/participantStore'
import { useNotification } from '@/hooks/useNotification'
import { isRequired, isValidJoinCode } from '@/utils/validators'
import { formatJoinCode } from '@/utils/formatters'

/** Participant join page: enter room code + name, validated against the join endpoint. */
export default function JoinPage() {
  const navigate = useNavigate()
  const notify = useNotification()
  const { code: codeFromUrl } = useParams<{ code?: string }>()
  const setParticipant = useParticipantStore((s) => s.setParticipant)

  const [joinCode, setJoinCode] = useState(codeFromUrl ?? '')
  const [evaluatorName, setEvaluatorName] = useState('')
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!isValidJoinCode(joinCode)) nextErrors.code = 'Código inválido.'
    if (!isRequired(evaluatorName)) nextErrors.name = 'Tu nombre es obligatorio.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const formattedCode = formatJoinCode(joinCode)
    setIsLoading(true)
    try {
      await evaluationService.joinByCode(formattedCode)
      setParticipant(formattedCode, evaluatorName.trim())
      notify.success('¡Te uniste a la sala!')
      navigate(`/play/${formattedCode}`)
    } catch {
      notify.error('Código de sala inválido o sala no encontrada.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="📚 Unirse a Sala" subtitle="Evaluaciones en vivo, estilo Kahoot">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Código de Sala"
          placeholder="Ej: ROOM-9F3A"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          error={errors.code}
          className="text-center font-display text-h3 tracking-widest"
        />
        <Input
          label="Tu Nombre"
          placeholder="Ej: Juan Pérez"
          value={evaluatorName}
          onChange={(e) => setEvaluatorName(e.target.value)}
          error={errors.name}
        />
        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          <Rocket className="h-5 w-5" />
          Entrar a Sala
        </Button>
      </form>
    </AuthLayout>
  )
}
