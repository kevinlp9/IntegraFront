import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AlumnoUser } from '@/types'

interface AlumnoState {
  alumno: AlumnoUser | null
  isLoggedIn: boolean
  setAlumno: (alumno: AlumnoUser) => void
  logout: () => void
}

/**
 * Estado del alumno evaluador autenticado (boleta + contraseña).
 * Se persiste en localStorage para mantener la sesión entre recargas; el token
 * JWT correspondiente lo guarda `tokenStore` (services/token.ts).
 */
export const useAlumnoStore = create<AlumnoState>()(
  persist(
    (set) => ({
      alumno: null,
      isLoggedIn: false,
      setAlumno: (alumno) => set({ alumno, isLoggedIn: true }),
      logout: () => set({ alumno: null, isLoggedIn: false }),
    }),
    { name: 'integra-alumno' },
  ),
)
