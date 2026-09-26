import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string | Date): string {
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es })
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function formatScore(score: number, maxScore?: number): string {
  const rounded = score.toFixed(1)
  return maxScore ? `${rounded} / ${maxScore.toFixed(1)}` : rounded
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

export function formatJoinCode(code: string): string {
  return code.trim().toUpperCase()
}
