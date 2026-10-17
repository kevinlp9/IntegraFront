export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

/** Boleta: solo dígitos, entre 8 y 20 caracteres (ajústalo a tu institución). */
export function isValidBoleta(boleta: string): boolean {
  return /^\d{8,20}$/.test(boleta.trim())
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
