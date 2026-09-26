export type UserRole = 'teacher' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
