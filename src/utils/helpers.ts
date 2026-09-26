import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges Tailwind classes, resolving conflicts (last one wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function totalScore(scores: number[]): number {
  return scores.reduce((acc, s) => acc + s, 0)
}

export function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}
