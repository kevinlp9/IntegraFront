import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { formatScore } from '@/utils/formatters'
import type { CreateExpositionPayload, Exposition } from '@/types'

export interface ExpositionsPanelProps {
  expositions: Exposition[]
  onCreate: (payload: CreateExpositionPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onActivate: (id: string) => Promise<void>
}

const statusIcon: Record<Exposition['status'], ReactNode> = {
  active: <CheckCircleIcon className="h-5 w-5 text-secondary-600" />,
  pending: <ClockIcon className="h-5 w-5 text-gray-400" />,
  completed: <CheckCircleIcon className="h-5 w-5 text-primary-600" />,
}

/** Manages a room's exposition teams: list, add, delete and activate. */
export function ExpositionsPanel({
  expositions,
  onCreate,
  onDelete,
  onActivate,
}: ExpositionsPanelProps) {
  const [teamName, setTeamName] = useState('')
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return
    setIsLoading(true)
    try {
      await onCreate({ teamName: teamName.trim(), topic: topic.trim() })
      setTeamName('')
      setTopic('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="outlined">
      <h3 className="mb-4 text-h3 text-gray-900 dark:text-gray-50">
        Equipos ({expositions.length})
      </h3>

      <ul className="mb-4 space-y-2">
        <AnimatePresence>
          {expositions.map((exp) => (
            <motion.li
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-2">
                {statusIcon[exp.status]}
                <div>
                  <p className="text-body-sm font-medium text-gray-800 dark:text-gray-100">
                    {exp.teamName}
                  </p>
                  {exp.topic && (
                    <p className="text-caption text-gray-500">{exp.topic}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {exp.averageScore !== undefined && (
                  <span className="text-body-sm font-semibold text-primary-700">
                    {formatScore(exp.averageScore, 10)}
                  </span>
                )}
                {exp.status !== 'active' && (
                  <button
                    type="button"
                    onClick={() => onActivate(exp.id)}
                    className="text-caption font-semibold text-primary-600 hover:underline"
                  >
                    Activar
                  </button>
                )}
                <button
                  type="button"
                  aria-label={`Eliminar ${exp.teamName}`}
                  onClick={() => onDelete(exp.id)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-error"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {expositions.length === 0 && (
          <p className="py-4 text-center text-body-sm text-gray-400">
            Aún no hay equipos registrados.
          </p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Nombre del equipo"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Tema (opcional)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading}>
          <PlusIcon className="h-4 w-4" />
          Agregar
        </Button>
      </form>
    </Card>
  )
}
