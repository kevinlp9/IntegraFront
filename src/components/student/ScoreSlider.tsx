import { getScoreColor } from '@/constants/colors'

export interface ScoreSliderProps {
  label: string
  maxScore: number
  score: number
  onChange: (score: number) => void
}

/**
 * Visual slider for scoring a single rubric criterion from 0 to maxScore,
 * in 0.5-point steps, showing the live value.
 */
export function ScoreSlider({
  label,
  maxScore,
  score,
  onChange,
}: ScoreSliderProps) {
  const color = getScoreColor(score, maxScore)
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-body-sm font-medium text-gray-700 dark:text-gray-300">
          {label}{' '}
          <span className="text-caption text-gray-400">
            (max {maxScore.toFixed(1)})
          </span>
        </label>
        <span
          className="rounded-full px-2.5 py-0.5 text-body-sm font-semibold"
          style={{ color, backgroundColor: `${color}1A` }}
        >
          {score.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={maxScore}
        step={0.5}
        value={score}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary-600 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, ${color} ${percentage}%, #E5E7EB ${percentage}%)`,
        }}
        aria-label={label}
      />
    </div>
  )
}
