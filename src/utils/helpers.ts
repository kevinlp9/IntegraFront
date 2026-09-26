import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges Tailwind classes, resolving conflicts (last one wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Generates a mock join code, e.g. "CALC-482". Backend should own the real logic. */
export function generateJoinCode(prefix: string): string {
  const suffix = Math.floor(100 + Math.random() * 900)
  return `${prefix.slice(0, 4).toUpperCase()}-${suffix}`
}

export function totalScore(scores: number[]): number {
  return scores.reduce((acc, s) => acc + s, 0)
}

export function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}
