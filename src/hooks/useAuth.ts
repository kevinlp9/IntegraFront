import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase, loginWithGoogle } from '@/services/supabase'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { MESSAGES } from '@/constants/messages'

/**
 * Manages the host's Supabase session: listens for auth state changes,
 * syncs the profile via GET /api/auth/me once logged in, and exposes
 * login/logout actions.
 */
export function useAuth() {
  const navigate = useNavigate()
  const {
    session,
    hostUser,
    isLoggedIn,
    isInitialized,
    setSession,
    setHostUser,
    setInitialized,
    logout,
  } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setInitialized()
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setInitialized()
      },
    )

    return () => listener.subscription.unsubscribe()
  }, [setSession, setInitialized])

  useEffect(() => {
    if (session && !hostUser) {
      authService
        .me()
        .then(setHostUser)
        .catch(() => toast.error(MESSAGES.generic.networkError))
    }
  }, [session, hostUser, setHostUser])

  const login = useCallback(async () => {
    try {
      await loginWithGoogle()
    } catch {
      toast.error(MESSAGES.auth.loginError)
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    logout()
    toast.success(MESSAGES.auth.logoutSuccess)
    navigate('/login')
  }, [logout, navigate])

  return { session, hostUser, isLoggedIn, isInitialized, login, logout: signOut }
}
