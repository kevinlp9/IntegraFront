import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAlumnoStore } from '@/store/alumnoStore'

export interface AlumnoProtectedRouteProps {
  children: ReactNode
}

/**
 * Protege el flujo de evaluación del alumno: si no ha iniciado sesión con su
 * boleta + contraseña, lo redirige a /alumno/login.
 */
export function AlumnoProtectedRoute({ children }: AlumnoProtectedRouteProps) {
  const isLoggedIn = useAlumnoStore((s) => s.isLoggedIn)

  if (!isLoggedIn) return <Navigate to="/alumno/login" replace />
  return <>{children}</>
}
