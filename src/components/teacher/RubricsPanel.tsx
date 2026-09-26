import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import type { CreateRubricPayload, RubricCriteria } from '@/types'

export interface RubricsPanelProps {
  criteria: RubricCriteria[]
  onCreate: (payload: CreateRubricPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

/** Manages a room's rubric criteria: list + add/remove form. */
export function RubricsPanel({
  criteria,
  onCreate,
  onDelete,
}: RubricsPanelProps) {
  const [name, setName] = useState('')
  const [maxScore, setMaxScore] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const totalMax = criteria.reduce((acc, c) => acc + c.maxScore, 0)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const parsedMax = Number(maxScore)
    if (!name.trim() || !parsedMax || parsedMax <= 0) return
    setIsLoading(true)
    try {
      await onCreate({ name: name.trim(), maxScore: parsedMax })
      setName('')
      setMaxScore('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="outlined">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-h3 text-gray-900 dark:text-gray-50">
          Criterios ({criteria.length})
        </h3>
        <span className="text-body-sm text-gray-500">
          Total: {totalMax.toFixed(1)} pts
        </span>
      </div>

      <ul className="mb-4 space-y-2">
        <AnimatePresence>
          {criteria.map((c) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-gray-700/50"
            >
              <span className="text-body-sm text-gray-800 dark:text-gray-100">
                {c.name}{' '}
                <span className="text-gray-400">
                  ({c.maxScore.toFixed(1)})
                </span>
              </span>
              <button
                type="button"
                aria-label={`Eliminar ${c.name}`}
                onClick={() => onDelete(c.id)}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-error"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {criteria.length === 0 && (
          <p className="py-4 text-center text-body-sm text-gray-400">
            Aún no hay criterios definidos.
          </p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Nombre del criterio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Input
          type="number"
          step="0.5"
          min="0"
          placeholder="Puntaje máx."
          value={maxScore}
          onChange={(e) => setMaxScore(e.target.value)}
          className="sm:w-32"
        />
        <Button type="submit" isLoading={isLoading}>
          <PlusIcon className="h-4 w-4" />
          Agregar
        </Button>
      </form>
    </Card>
  )
}
