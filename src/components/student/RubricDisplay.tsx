import { Card } from '@/components/common/Card'
import type { Exposition } from '@/types'

export interface RubricDisplayProps {
  exposition: Exposition
}

/** Header card showing the currently active exposition being evaluated. */
export function RubricDisplay({ exposition }: RubricDisplayProps) {
  return (
    <Card variant="filled" className="text-center">
      <p className="text-body-sm font-medium text-primary-600">
        🎤 Evaluando
      </p>
      <h2 className="text-h3 text-gray-900 dark:text-gray-50">
        {exposition.teamName}
      </h2>
      {exposition.topic && (
        <p className="mt-1 text-body-sm text-gray-500">{exposition.topic}</p>
      )}
    </Card>
  )
}
