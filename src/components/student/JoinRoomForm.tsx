import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { isRequired, isValidJoinCode } from '@/utils/validators'
import { formatJoinCode } from '@/utils/formatters'

export interface JoinRoomFormProps {
  onJoin: (joinCode: string, studentName: string) => Promise<void>
}

/** Student-facing form to join a room by code and name. */
export function JoinRoomForm({ onJoin }: JoinRoomFormProps) {
  const [joinCode, setJoinCode] = useState('')
  const [studentName, setStudentName] = useState('')
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: { code?: string; name?: string } = {}
    if (!isValidJoinCode(joinCode)) {
      nextErrors.code = 'Ingresa un código de sala válido.'
    }
    if (!isRequired(studentName)) {
      nextErrors.name = 'Tu nombre es obligatorio.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      await onJoin(formatJoinCode(joinCode), studentName.trim())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Código de Sala"
        placeholder="Ej: CALC-123"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        error={errors.code}
        autoCapitalize="characters"
      />
      <Input
        label="Tu Nombre"
        placeholder="Ej: Juan Pérez"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        error={errors.name}
      />
      <Button type="submit" fullWidth isLoading={isLoading} size="lg">
        Entrar a Sala
      </Button>
    </form>
  )
}
