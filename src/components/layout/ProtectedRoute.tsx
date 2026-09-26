import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'

export interface ProtectedRouteProps {
  children: ReactNode
  role?: UserRole
}

/** Redirects to /login if unauthenticated, or to the correct home if wrong role. */
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuthStore()

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (role && user?.role !== role) {
    return (
      <Navigate
        to={user?.role === 'teacher' ? '/teacher/dashboard' : '/join'}
        replace
      />
    )
  }
  return <>{children}</>
}
