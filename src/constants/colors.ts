/**
 * Color tokens mirrored from tailwind.config.js for use in JS/TS contexts
 * (e.g. inline styles, Recharts fill colors, canvas-confetti) where Tailwind
 * classes cannot be used directly.
 */
export const COLORS = {
  background: '#0B0F19',
  surface: '#151B2C',
  surfaceElevated: '#1E2740',
  primary: '#7C3AED',
  accentBlue: '#3B82F6',
  accentGreen: '#10B981',
  accentRed: '#EF4444',
  accentAmber: '#F59E0B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
} as const

/** Kahoot-style answer option colors, one per option index (max 4 options shown as buttons). */
export const OPTION_COLORS = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981']
export const OPTION_SHAPES = ['▲', '◆', '●', '■']

/** Returns a performance color based on the ratio of score to max score. */
export function getScoreColor(score: number, maxScore: number): string {
  const ratio = maxScore > 0 ? score / maxScore : 0
  if (ratio >= 0.75) return COLORS.accentGreen
  if (ratio >= 0.5) return COLORS.accentAmber
  return COLORS.accentRed
}
