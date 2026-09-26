import { Star } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Textarea } from '@/components/common/Input'
import { AnswerOptionButton } from './AnswerOptionButton'
import type { RubricCriterion } from '@/types'

export interface QuestionAnswerValue {
  score_given?: number
  selected_option?: string
  text_answer?: string
}

export interface QuestionCardProps {
  criterion: RubricCriterion
  value: QuestionAnswerValue
  onChange: (value: QuestionAnswerValue) => void
}

/** Renders the correct input UI for a rubric criterion based on its question_type. */
export function QuestionCard({ criterion, value, onChange }: QuestionCardProps) {
  return (
    <Card variant="outlined" className="space-y-4">
      <h3 className="text-h3 text-text-primary">{criterion.name}</h3>

      {criterion.question_type === 'rating' && (
        <RatingInput
          maxScore={criterion.max_score}
          value={value.score_given ?? 0}
          onChange={(score) => onChange({ score_given: score })}
        />
      )}

      {criterion.question_type === 'multiple_choice' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(criterion.options ?? []).map((opt, i) => (
            <AnswerOptionButton
              key={opt}
              index={i}
              label={opt}
              isSelected={value.selected_option === opt}
              onClick={() => onChange({ selected_option: opt })}
            />
          ))}
        </div>
      )}

      {criterion.question_type === 'true_false' && (
        <div className="grid grid-cols-2 gap-3">
          <AnswerOptionButton
            index={3}
            label="✅ Verdadero"
            isSelected={value.selected_option === 'true'}
            onClick={() => onChange({ selected_option: 'true' })}
          />
          <AnswerOptionButton
            index={0}
            label="❌ Falso"
            isSelected={value.selected_option === 'false'}
            onClick={() => onChange({ selected_option: 'false' })}
          />
        </div>
      )}

      {criterion.question_type === 'open_text' && (
        <Textarea
          placeholder="Escribe tu respuesta..."
          value={value.text_answer ?? ''}
          maxLength={500}
          onChange={(e) => onChange({ text_answer: e.target.value })}
          helperText={`${(value.text_answer ?? '').length}/500`}
        />
      )}
    </Card>
  )
}

interface RatingInputProps {
  maxScore: number
  value: number
  onChange: (score: number) => void
}

/** Star-style rating selector from 0 to maxScore (in whole-point steps). */
function RatingInput({ maxScore, value, onChange }: RatingInputProps) {
  const stars = Array.from({ length: maxScore }, (_, i) => i + 1)
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} de ${maxScore}`}
            onClick={() => onChange(n)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className="h-8 w-8"
              fill={n <= value ? '#F59E0B' : 'transparent'}
              stroke="#F59E0B"
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-body-sm text-text-secondary">
        Puntuación: <span className="font-semibold text-text-primary">{value}</span> / {maxScore}
      </p>
    </div>
  )
}
