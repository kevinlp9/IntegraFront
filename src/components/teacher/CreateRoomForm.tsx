import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { isRequired } from '@/utils/validators'
import type { CreateRoomPayload } from '@/types'

export interface CreateRoomFormProps {
  onSubmit: (payload: CreateRoomPayload) => Promise<unknown>
  onCancel?: () => void
}

/** Form used by teachers to create a new evaluation room. */
export function CreateRoomForm({ onSubmit, onCancel }: CreateRoomFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isRequired(name)) {
      setError('El nombre de la sala es obligatorio.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
      setName('')
      setDescription('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la sala"
        placeholder="Ej: Cálculo Multivariable"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
      />
      <Textarea
        label="Descripción (opcional)"
        placeholder="Breve descripción de la sala..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" fullWidth isLoading={isLoading}>
          Crear Sala
        </Button>
      </div>
    </form>
  )
}
