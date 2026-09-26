import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { roomService } from '@/services/room.service'
import { evaluationService } from '@/services/evaluation.service'
import { useEvaluationStore } from '@/store/evaluationStore'
import { MESSAGES } from '@/constants/messages'
import type { Room, RoomReport } from '@/types'

/** Manages the student join + evaluation submission flow. */
export function useEvaluations() {
  const {
    currentExposition,
    currentEvaluations,
    setCurrentExposition,
    setCurrentEvaluations,
    updateEvaluation,
    resetEvaluations,
  } = useEvaluationStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const joinRoom = useCallback(async (joinCode: string): Promise<Room> => {
    try {
      const room = await roomService.joinByCode(joinCode)
      return room
    } catch {
      toast.error(MESSAGES.room.joinError)
      throw new Error(MESSAGES.room.joinError)
    }
  }, [])

  const submitEvaluation = useCallback(
    async (evaluatorName: string, comment?: string) => {
      if (!currentExposition) return
      const incomplete = currentEvaluations.some((ev) => ev.score < 0)
      if (incomplete) {
        toast.error(MESSAGES.evaluation.incomplete)
        return
      }
      setIsSubmitting(true)
      try {
        await evaluationService.submit({
          expositionId: currentExposition.id,
          evaluatorName,
          scores: currentEvaluations.map((ev) => ({
            criteriaId: ev.criteriaId,
            score: ev.score,
          })),
          comment,
        })
        toast.success(MESSAGES.evaluation.submitSuccess)
        resetEvaluations()
      } catch {
        toast.error(MESSAGES.evaluation.submitError)
        throw new Error(MESSAGES.evaluation.submitError)
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentExposition, currentEvaluations, resetEvaluations],
  )

  return {
    currentExposition,
    currentEvaluations,
    isSubmitting,
    setCurrentExposition,
    setCurrentEvaluations,
    updateEvaluation,
    joinRoom,
    submitEvaluation,
  }
}

/** Fetches the consolidated report for a room (teacher reports view). */
export function useRoomReport(roomId?: string) {
  const [report, setReport] = useState<RoomReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchReport = useCallback(async () => {
    if (!roomId) return
    setIsLoading(true)
    try {
      const data = await evaluationService.getReport(roomId)
      setReport(data)
    } catch {
      toast.error(MESSAGES.generic.networkError)
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  return { report, isLoading, fetchReport }
}
