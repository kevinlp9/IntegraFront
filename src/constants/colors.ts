/**
 * Color tokens mirrored from tailwind.config.js for use in JS/TS contexts
 * (e.g. inline styles, Recharts fill colors) where Tailwind classes cannot be used.
 */
export const COLORS = {
  primary: {
    50: '#EFF6FF',
    600: '#2563EB',
    700: '#1E40AF',
    900: '#0F172A',
  },
  secondary: {
    600: '#16A34A',
    100: '#DCFCE7',
  },
  accent: {
    600: '#EA580C',
    50: '#FEF3C7',
  },
  neutral: {
    900: '#111827',
    600: '#4B5563',
    200: '#E5E7EB',
    50: '#F9FAFB',
  },
  state: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const

/** Returns a performance color based on the ratio of score to max score. */
export function getScoreColor(score: number, maxScore: number): string {
  const ratio = maxScore > 0 ? score / maxScore : 0
  if (ratio >= 0.75) return COLORS.state.success
  if (ratio >= 0.5) return COLORS.accent[600]
  return COLORS.state.error
}
