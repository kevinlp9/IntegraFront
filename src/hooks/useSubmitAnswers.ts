import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { evaluationService } from '@/services/evaluation.service'
import { MESSAGES } from '@/constants/messages'
import type { EvaluationScoreInput } from '@/types'

/** Submits all answers for the currently active exposition in a single request. */
export function useSubmitAnswers() {
  const mutation = useMutation({
    mutationFn: (payload: {
      joinCode: string
      evaluatorName: string
      scores: EvaluationScoreInput[]
    }) =>
      evaluationService.submit({
        join_code: payload.joinCode,
        evaluator_name: payload.evaluatorName,
        scores: payload.scores,
      }),
    onSuccess: () => toast.success(MESSAGES.evaluation.submitSuccess),
    onError: (error: Error) =>
      toast.error(error.message || MESSAGES.evaluation.submitError),
  })

  return {
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  }
}
