import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, ListChecks, ToggleLeft, MessageSquare } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Input, Select } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import type { QuestionType, RubricCriterion, RubricCriterionCreate } from '@/types'

export interface RubricsPanelProps {
  criteria: RubricCriterion[]
  onCreate: (payload: RubricCriterionCreate) => Promise<unknown>
}

const typeOptions = [
  { label: 'Calificación (rating)', value: 'rating' },
  { label: 'Opción múltiple', value: 'multiple_choice' },
  { label: 'Verdadero / Falso', value: 'true_false' },
  { label: 'Texto libre', value: 'open_text' },
]

const typeIcon: Record<QuestionType, ReactNode> = {
  rating: <Star className="h-4 w-4" />,
  multiple_choice: <ListChecks className="h-4 w-4" />,
  true_false: <ToggleLeft className="h-4 w-4" />,
  open_text: <MessageSquare className="h-4 w-4" />,
}

/** Manages a room's questions (rubric criteria): list + dynamic add form per question_type. */
export function RubricsPanel({ criteria, onCreate }: RubricsPanelProps) {
  const [name, setName] = useState('')
  const [questionType, setQuestionType] = useState<QuestionType>('rating')
  const [maxScore, setMaxScore] = useState('10')
  const [optionsText, setOptionsText] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = () => {
    setName('')
    setQuestionType('rating')
    setMaxScore('10')
    setOptionsText('')
    setCorrectAnswer('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const payload: RubricCriterionCreate = {
      name: name.trim(),
      question_type: questionType,
      max_score: questionType === 'rating' ? Number(maxScore) || 10 : undefined,
    }

    if (questionType === 'multiple_choice') {
      const options = optionsText
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
      if (options.length < 2 || !correctAnswer.trim()) return
      payload.options = options
      payload.correct_answer = correctAnswer.trim()
    }
    if (questionType === 'true_false') {
      payload.correct_answer = correctAnswer || 'true'
    }

    setIsLoading(true)
    try {
      await onCreate(payload)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="outlined">
      <h3 className="mb-4 text-h3 text-text-primary">
        Preguntas ({criteria.length})
      </h3>

      <ul className="mb-4 space-y-2">
        <AnimatePresence>
          {criteria.map((c) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5"
            >
              <span className="text-primary-300">{typeIcon[c.question_type]}</span>
              <div className="flex-1">
                <p className="text-body-sm font-medium text-text-primary">
                  {c.name}
                </p>
                {c.question_type === 'multiple_choice' && c.options && (
                  <p className="text-caption text-text-secondary">
                    {c.options.join(' · ')}
                  </p>
                )}
              </div>
              {c.question_type === 'rating' && (
                <span className="text-caption text-text-secondary">
                  max {c.max_score}
                </span>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
        {criteria.length === 0 && (
          <p className="py-4 text-center text-body-sm text-text-secondary">
            Aún no hay preguntas.
          </p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Enunciado de la pregunta"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          value={questionType}
          onChange={(v) => setQuestionType(v as QuestionType)}
          options={typeOptions}
        />

        {questionType === 'rating' && (
          <Input
            type="number"
            min="1"
            placeholder="Puntaje máximo"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
          />
        )}

        {questionType === 'multiple_choice' && (
          <>
            <Input
              placeholder="Opciones separadas por coma (mín. 2)"
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
            />
            <Input
              placeholder="Respuesta correcta (debe coincidir con una opción)"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </>
        )}

        {questionType === 'true_false' && (
          <Select
            value={correctAnswer || 'true'}
            onChange={setCorrectAnswer}
            options={[
              { label: 'Verdadero', value: 'true' },
              { label: 'Falso', value: 'false' },
            ]}
          />
        )}

        <Button type="submit" fullWidth isLoading={isLoading}>
          <Plus className="h-4 w-4" />
          Agregar pregunta
        </Button>
      </form>
    </Card>
  )
}
