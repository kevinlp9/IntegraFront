export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isValidJoinCode(code: string): boolean {
  return /^[A-Za-z0-9-]{4,20}$/.test(code.trim())
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export function isValidScore(score: number, maxScore: number): boolean {
  return score >= 0 && score <= maxScore
}
