import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import type { HostUser } from '@/types'

interface AuthState {
  session: Session | null
  hostUser: HostUser | null
  /** Token propio del backend cuando el profe entra con correo + contraseña. */
  hostToken: string | null
  isLoggedIn: boolean
  /** True once the initial auth check (Supabase session + stored token) resolved. */
  isInitialized: boolean
  setSession: (session: Session | null) => void
  setHostUser: (user: HostUser | null) => void
  setHostToken: (token: string | null) => void
  setInitialized: () => void
  logout: () => void
}

function computeLoggedIn(session: Session | null, hostToken: string | null): boolean {
  return !!session || !!hostToken
}

/** Global auth state for the host: Supabase session (Google) o token propio (contraseña). */
export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  hostUser: null,
  hostToken: null,
  isLoggedIn: false,
  isInitialized: false,
  setSession: (session) =>
    set({ session, isLoggedIn: computeLoggedIn(session, get().hostToken) }),
  setHostUser: (hostUser) => set({ hostUser }),
  setHostToken: (hostToken) =>
    set({ hostToken, isLoggedIn: computeLoggedIn(get().session, hostToken) }),
  setInitialized: () => set({ isInitialized: true }),
  logout: () =>
    set({ session: null, hostUser: null, hostToken: null, isLoggedIn: false }),
}))
