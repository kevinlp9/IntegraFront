import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy } from 'lucide-react'
import type { ExpositionReport } from '@/types'

export interface PodiumViewProps {
  expositions: ExpositionReport[]
}

const medal = ['🥇', '🥈', '🥉']
const podiumHeight = ['h-40', 'h-28', 'h-20']
const podiumOrder = [1, 0, 2] // visual order: 2nd, 1st, 3rd

const containerVariants = {
  animate: { transition: { staggerChildren: 0.15 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

/** Animated top-3 podium with confetti, Kahoot-style. */
export function PodiumView({ expositions }: PodiumViewProps) {
  const top3 = expositions.slice(0, 3)

  useEffect(() => {
    if (top3.length === 0) return
    void confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#3B82F6', '#F59E0B', '#10B981'],
    })
  }, [top3.length])

  if (top3.length === 0) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex items-end justify-center gap-4 py-8"
    >
      {podiumOrder
        .filter((i) => i < top3.length)
        .map((i) => {
          const exp = top3[i]
          return (
            <motion.div
              key={exp.exposition_id}
              variants={itemVariants}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-4xl">{medal[i]}</span>
              <p className="max-w-[120px] truncate text-body-sm font-semibold text-text-primary">
                {exp.name}
              </p>
              <p className="flex items-center gap-1 text-body-sm font-bold text-accent-amber">
                <Trophy className="h-4 w-4" />
                {exp.final_score?.toFixed(1) ?? '—'}
              </p>
              <div
                className={`w-24 rounded-t-2xl bg-hero-gradient ${podiumHeight[i]}`}
              />
            </motion.div>
          )
        })}
    </motion.div>
  )
}
