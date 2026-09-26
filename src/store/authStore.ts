import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import type { HostUser } from '@/types'

interface AuthState {
  session: Session | null
  hostUser: HostUser | null
  isLoggedIn: boolean
  /** True once the initial Supabase session check has resolved. */
  isInitialized: boolean
  setSession: (session: Session | null) => void
  setHostUser: (user: HostUser | null) => void
  setInitialized: () => void
  logout: () => void
}

/** Global auth state for the host, backed by the Supabase session. */
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  hostUser: null,
  isLoggedIn: false,
  isInitialized: false,
  setSession: (session) => set({ session, isLoggedIn: !!session }),
  setHostUser: (hostUser) => set({ hostUser }),
  setInitialized: () => set({ isInitialized: true }),
  logout: () => set({ session: null, hostUser: null, isLoggedIn: false }),
}))
