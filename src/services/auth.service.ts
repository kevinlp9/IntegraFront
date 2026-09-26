import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type { HostUser } from '@/types'

export const authService = {
  /** Syncs the Supabase-authenticated user with the backend; call once after login. */
  async me(): Promise<HostUser> {
    return api.get<HostUser>(ENDPOINTS.auth.me)
  },
}
