import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type {
  AuthResponse,
  LoginCredentials,
  SignupPayload,
  User,
} from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      ENDPOINTS.auth.login,
      credentials,
    )
    return data
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      ENDPOINTS.auth.signup,
      payload,
    )
    return data
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>(ENDPOINTS.auth.me)
    return data
  },

  async logout(): Promise<void> {
    await api.post(ENDPOINTS.auth.logout)
  },
}
