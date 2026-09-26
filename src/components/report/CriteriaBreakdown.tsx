import { motion } from 'framer-motion'
import { getScoreColor } from '@/constants/colors'
import type { CriterionAverage } from '@/types'

export interface CriteriaBreakdownProps {
  criteria: CriterionAverage[]
}

/** Animated progress bars showing the average score per criterion. */
export function CriteriaBreakdown({ criteria }: CriteriaBreakdownProps) {
  return (
    <div className="space-y-3">
      {criteria.map((c) => {
        const percentage =
          c.max_score > 0 ? (c.average_score / c.max_score) * 100 : 0
        const color = getScoreColor(c.average_score, c.max_score)
        return (
          <div key={c.criteria_id}>
            <div className="mb-1 flex justify-between text-body-sm">
              <span className="text-text-secondary">{c.name}</span>
              <span className="font-semibold text-text-primary">
                {c.average_score.toFixed(1)} / {c.max_score.toFixed(1)}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <p className="mt-0.5 text-caption text-text-secondary">
              {c.total_votes} voto(s)
            </p>
          </div>
        )
      })}
    </div>
  )
}
