import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'
import { OPTION_COLORS, OPTION_SHAPES } from '@/constants/colors'

export interface AnswerOptionButtonProps {
  index: number
  label: string
  isSelected: boolean
  onClick: () => void
}

/** Kahoot-style colored/shaped answer option button, large and touch-friendly. */
export function AnswerOptionButton({
  index,
  label,
  isSelected,
  onClick,
}: AnswerOptionButtonProps) {
  const color = OPTION_COLORS[index % OPTION_COLORS.length]
  const shape = OPTION_SHAPES[index % OPTION_SHAPES.length]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-body-lg font-semibold text-white shadow-lg transition-all',
        isSelected ? 'ring-4 ring-white/70 scale-[1.02]' : 'opacity-90 hover:opacity-100',
      )}
      style={{ backgroundColor: color }}
    >
      <span className="text-h3 leading-none">{shape}</span>
      <span>{label}</span>
    </motion.button>
  )
}
