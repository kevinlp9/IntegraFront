import { useEffect } from 'react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, PartyPopper } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { QuestionCard } from '@/components/questions/QuestionCard'
import type { QuestionAnswerValue } from '@/components/questions/QuestionCard'
import { useParticipantStore } from '@/store/participantStore'
import { useRoomJoin } from '@/hooks/useRoomJoin'
import { useSubmitAnswers } from '@/hooks/useSubmitAnswers'
import { useNotification } from '@/hooks/useNotification'
import { MESSAGES } from '@/constants/messages'
import type { Exposition, EvaluationScoreInput, RubricCriterion } from '@/types'

/**
 * Participant play screen. Polls the room's public state every 2.5s and
 * renders the appropriate screen: lobby (waiting), question form (active +
 * new exposition), waiting-for-next (already answered), or finished.
 */
export default function PlayPage() {
  const navigate = useNavigate()
  const { code: codeFromUrl } = useParams<{ code: string }>()
  const {
    joinCode: storedCode,
    evaluatorName,
    lastAnsweredExpositionId,
    markAnswered,
  } = useParticipantStore()
  const joinCode = storedCode ?? codeFromUrl ?? null

  const { data, isError } = useRoomJoin(joinCode)

  useEffect(() => {
    if (!joinCode || !evaluatorName) navigate('/join')
  }, [joinCode, evaluatorName, navigate])

  if (isError) {
    return (
      <CenteredMessage>
        <p className="text-body text-text-secondary">
          {MESSAGES.room.joinError}
        </p>
      </CenteredMessage>
    )
  }

  if (!data) {
    return (
      <CenteredMessage>
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </CenteredMessage>
    )
  }

  if (data.room_status === 'finished') {
    return (
      <CenteredMessage>
        <PartyPopper className="h-12 w-12 text-accent-amber" />
        <h1 className="mt-4 font-display text-h2 text-text-primary">
          ¡Gracias por participar! 🎉
        </h1>
        <p className="mt-2 text-body-sm text-text-secondary">{data.room_name}</p>
      </CenteredMessage>
    )
  }

  const activeExposition = data.current_exposition
  const alreadyAnswered =
    activeExposition && activeExposition.id === lastAnsweredExpositionId

  if (data.room_status === 'waiting' || !activeExposition) {
    return (
      <CenteredMessage>
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        <h1 className="mt-4 font-display text-h3 text-text-primary">
          {data.room_name}
        </h1>
        <p className="mt-1 text-body-sm text-text-secondary">
          Hola {evaluatorName}, esperando a que el host inicie…
        </p>
      </CenteredMessage>
    )
  }

  if (alreadyAnswered) {
    return (
      <CenteredMessage>
        <CheckCircle2 className="h-12 w-12 text-accent-green" />
        <h1 className="mt-4 font-display text-h3 text-text-primary">
          ¡Respuesta enviada!
        </h1>
        <p className="mt-1 text-body-sm text-text-secondary">
          Esperando el siguiente elemento…
        </p>
      </CenteredMessage>
    )
  }

  return (
    <QuestionForm
      key={activeExposition.id}
      exposition={activeExposition}
      rubric={data.rubric}
      joinCode={joinCode!}
      evaluatorName={evaluatorName!}
      onAnswered={markAnswered}
    />
  )
}

interface QuestionFormProps {
  exposition: Exposition
  rubric: RubricCriterion[]
  joinCode: string
  evaluatorName: string
  onAnswered: (expositionId: number) => void
}

/** Renders the answer form for the active exposition; keyed by exposition id so its
 * local state resets automatically whenever a new element becomes active. */
function QuestionForm({
  exposition,
  rubric,
  joinCode,
  evaluatorName,
  onAnswered,
}: QuestionFormProps) {
  const notify = useNotification()
  const { submit, isSubmitting } = useSubmitAnswers()
  const [answers, setAnswers] = useState<Record<number, QuestionAnswerValue>>({})

  const handleSubmit = async () => {
    const scores: EvaluationScoreInput[] = rubric.map((c) => ({
      criteria_id: c.id,
      ...answers[c.id],
    }))
    const incomplete = scores.some(
      (s) =>
        s.score_given === undefined &&
        s.selected_option === undefined &&
        (s.text_answer === undefined || s.text_answer.trim() === ''),
    )
    if (incomplete) {
      notify.error(MESSAGES.evaluation.incomplete)
      return
    }
    try {
      await submit({ joinCode, evaluatorName, scores })
      onAnswered(exposition.id)
    } catch {
      // toast handled in useSubmitAnswers
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        <Card variant="filled" className="text-center">
          <p className="text-body-sm font-medium text-primary-300">
            🎤 Evaluando
          </p>
          <h2 className="font-display text-h2 text-text-primary">
            {exposition.name}
          </h2>
        </Card>

        <AnimatePresence mode="popLayout">
          {rubric.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <QuestionCard
                criterion={c}
                value={answers[c.id] ?? {}}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, [c.id]: value }))
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <Button fullWidth size="lg" isLoading={isSubmitting} onClick={handleSubmit}>
          Enviar respuestas
        </Button>
      </div>
    </div>
  )
}

function CenteredMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {children}
    </div>
  )
}
