import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getScoreColor } from '@/constants/colors'
import type { CriteriaScore } from '@/types'

export interface PerformanceChartProps {
  teamName: string
  criteriaBreakdown: CriteriaScore[]
}

/** Bar chart showing per-criterion scores, colored by performance level. */
export function PerformanceChart({
  teamName,
  criteriaBreakdown,
}: PerformanceChartProps) {
  const data = criteriaBreakdown.map((c) => ({
    name: c.criteriaName,
    score: Number(c.score.toFixed(2)),
    maxScore: c.maxScore,
  }))

  return (
    <div className="w-full">
      <p className="mb-2 text-body-sm font-medium text-gray-600 dark:text-gray-300">
        Desempeño por criterio — {teamName}
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | string) => [String(value), 'Puntaje']}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={getScoreColor(entry.score, entry.maxScore)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
