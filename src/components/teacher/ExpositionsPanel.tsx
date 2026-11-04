import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trophy, UserPlus } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Tooltip } from '@/components/common/Tooltip'
import type {
  CreateExpositionPayload,
  Exposition,
  RoomMode,
  RosterRow,
} from '@/types'

export interface ExpositionsPanelProps {
  expositions: Exposition[]
  currentExpositionId: number | null
  mode: RoomMode
  roster: RosterRow[]
  onCreate: (payload: CreateExpositionPayload) => Promise<unknown>
}

/** Manages a room's elements: teams (team mode) or students (individual mode). */
export function ExpositionsPanel({
  expositions,
  currentExpositionId,
  mode,
  roster,
  onCreate,
}: ExpositionsPanelProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const usedBoletas = new Set(
    expositions.map((e) => e.boleta).filter((b): b is string => !!b),
  )
  const availableStudents = roster.filter((r) => !usedBoletas.has(r.boleta))

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

  const addStudent = async (student: RosterRow) => {
    setIsLoading(true)
    try {
      await onCreate({ name: student.nombre, boleta: student.boleta })
    } finally {
      setIsLoading(false)
    }
  }

  const addAll = async () => {
    setIsLoading(true)
    try {
      for (const student of availableStudents) {
        await onCreate({ name: student.nombre, boleta: student.boleta })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="outlined">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-h3 text-text-primary">
          Elementos ({expositions.length})
        </h3>
        <Tooltip
          label={
            mode === 'individual'
              ? 'En modo individual cada elemento es un alumno de la lista oficial.'
              : 'En modo por equipo cada elemento es un equipo o ronda.'
          }
        >
          <span className="cursor-help rounded-full bg-white/10 px-2 text-caption text-text-secondary">
            {mode === 'individual' ? 'Individual' : 'Equipo'}
          </span>
        </Tooltip>
      </div>

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
                <span className="text-caption text-text-secondary">#{exp.order}</span>
                <p className="text-body-sm font-medium text-text-primary">{exp.name}</p>
                {exp.boleta && (
                  <span className="font-mono text-caption text-text-secondary">
                    {exp.boleta}
                  </span>
                )}
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

      {mode === 'individual' ? (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-body-sm font-semibold text-text-secondary">
              Agregar alumnos de la lista
            </span>
            {availableStudents.length > 0 && (
              <Button size="sm" variant="secondary" onClick={addAll} isLoading={isLoading}>
                <UserPlus className="h-4 w-4" />
                Agregar todos
              </Button>
            )}
          </div>
          {roster.length === 0 ? (
            <p className="py-3 text-center text-body-sm text-text-secondary">
              Este grupo no tiene lista de alumnos. Captúrala en la pestaña Alumnos.
            </p>
          ) : availableStudents.length === 0 ? (
            <p className="py-3 text-center text-body-sm text-text-secondary">
              Todos los alumnos ya están agregados ✅
            </p>
          ) : (
            <ul className="max-h-60 space-y-1.5 overflow-y-auto">
              {availableStudents.map((student) => (
                <li
                  key={student.boleta}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-body-sm text-text-primary">
                      {student.nombre}
                    </span>
                    <span className="block font-mono text-caption text-text-secondary">
                      {student.boleta}
                    </span>
                  </span>
                  <Button size="sm" onClick={() => addStudent(student)} isLoading={isLoading}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
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
      )}
    </Card>
  )
}
