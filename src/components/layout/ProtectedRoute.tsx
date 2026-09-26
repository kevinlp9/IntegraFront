import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/common/Spinner'

export interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Redirects to /login if the host is not authenticated via Supabase.
 * Waits for `isInitialized` (the first getSession() check) before deciding,
 * to avoid bouncing back to /login while the session is still being read.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    )
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}
