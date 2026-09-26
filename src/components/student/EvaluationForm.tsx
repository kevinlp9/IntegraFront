import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/common/Card'
import { Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { ScoreSlider } from './ScoreSlider'
import { SubmitEvaluationButton } from './SubmitEvaluationButton'
import { RubricDisplay } from './RubricDisplay'
import { totalScore } from '@/utils/helpers'
import type { Exposition, RubricCriteria } from '@/types'

export interface EvaluationFormProps {
  exposition: Exposition
  criteria: RubricCriteria[]
  onSubmit: (scores: Record<string, number>, comment: string) => Promise<void>
  isSubmitting?: boolean
}

/** Full evaluation flow: score sliders → review step → submit. */
export function EvaluationForm({
  exposition,
  criteria,
  onSubmit,
  isSubmitting = false,
}: EvaluationFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map((c) => [c.id, 0])),
  )
  const [comment, setComment] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)

  const maxTotal = criteria.reduce((acc, c) => acc + c.maxScore, 0)
  const currentTotal = totalScore(Object.values(scores))

  return (
    <div className="space-y-6">
      <RubricDisplay exposition={exposition} />

      <AnimatePresence mode="wait">
        {!isReviewing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-6"
          >
            <Card variant="outlined" className="space-y-6">
              {criteria.map((c) => (
                <ScoreSlider
                  key={c.id}
                  label={c.name}
                  maxScore={c.maxScore}
                  score={scores[c.id] ?? 0}
                  onChange={(value) =>
                    setScores((prev) => ({ ...prev, [c.id]: value }))
                  }
                />
              ))}
            </Card>

            <Textarea
              label="Comentario (opcional)"
              placeholder="Escribe una observación para el equipo..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button fullWidth size="lg" onClick={() => setIsReviewing(true)}>
              Revisar
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="space-y-6"
          >
            <Card variant="outlined" className="space-y-3">
              <h3 className="text-h3 text-gray-900 dark:text-gray-50">
                Confirma tu evaluación
              </h3>
              {criteria.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between border-b border-gray-100 pb-2 text-body-sm last:border-0 dark:border-gray-700"
                >
                  <span className="text-gray-600 dark:text-gray-300">
                    {c.name}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {(scores[c.id] ?? 0).toFixed(1)} / {c.maxScore.toFixed(1)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-body font-semibold">
                <span>Total</span>
                <span className="text-primary-700">
                  {currentTotal.toFixed(1)} / {maxTotal.toFixed(1)}
                </span>
              </div>
              {comment && (
                <p className="rounded-lg bg-gray-50 p-3 text-body-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                  “{comment}”
                </p>
              )}
            </Card>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                className="flex-1"
                onClick={() => setIsReviewing(false)}
              >
                Editar
              </Button>
              <div className="flex-1">
                <SubmitEvaluationButton
                  isSubmitting={isSubmitting}
                  onClick={() => onSubmit(scores, comment)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
