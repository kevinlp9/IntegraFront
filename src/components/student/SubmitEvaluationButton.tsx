import { Button } from '@/components/common/Button'

export interface SubmitEvaluationButtonProps {
  onClick: () => void
  isSubmitting?: boolean
  disabled?: boolean
}

/** Final call-to-action button to submit a student's evaluation. */
export function SubmitEvaluationButton({
  onClick,
  isSubmitting = false,
  disabled = false,
}: SubmitEvaluationButtonProps) {
  return (
    <Button
      fullWidth
      size="lg"
      onClick={onClick}
      disabled={disabled}
      isLoading={isSubmitting}
    >
      Enviar Evaluación
    </Button>
  )
}
