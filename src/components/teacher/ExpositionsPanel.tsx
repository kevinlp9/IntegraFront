import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trophy } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import type { CreateExpositionPayload, Exposition } from '@/types'

export interface ExpositionsPanelProps {
  expositions: Exposition[]
  currentExpositionId: number | null
  onCreate: (payload: CreateExpositionPayload) => Promise<unknown>
}

/** Manages a room's exposition items (teams/rounds/players): list + add form. */
export function ExpositionsPanel({
  expositions,
  currentExpositionId,
  onCreate,
}: ExpositionsPanelProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsLoading(true)
    try {
      await onCreate({ name: name.trim() })
      setName('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="outlined">
      <h3 className="mb-4 text-h3 text-text-primary">
        Elementos ({expositions.length})
      </h3>

      <ul className="mb-4 space-y-2">
        <AnimatePresence>
          {expositions.map((exp) => (
            <motion.li
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                exp.id === currentExpositionId
                  ? 'bg-accent-green/10 ring-1 ring-accent-green/40'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-caption text-text-secondary">
                  #{exp.order}
                </span>
                <p className="text-body-sm font-medium text-text-primary">
                  {exp.name}
                </p>
                {exp.id === currentExpositionId && (
                  <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-caption font-semibold text-accent-green">
                    Activo
                  </span>
                )}
              </div>
              {exp.final_score !== null && (
                <span className="flex items-center gap-1 text-body-sm font-semibold text-accent-amber">
                  <Trophy className="h-4 w-4" />
                  {exp.final_score.toFixed(1)}
                </span>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
        {expositions.length === 0 && (
          <p className="py-4 text-center text-body-sm text-text-secondary">
            Aún no hay elementos registrados.
          </p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ej: Equipo A, Ronda 1..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading}>
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </form>
    </Card>
  )
}
