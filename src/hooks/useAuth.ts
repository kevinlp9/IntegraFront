import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase, loginWithGoogle } from '@/services/supabase'
import { authService } from '@/services/auth.service'
import { tokenStore } from '@/services/token'
import { useAuthStore } from '@/store/authStore'
import { MESSAGES } from '@/constants/messages'
import type { ProfeLoginPayload, ProfeRegisterPayload } from '@/types'

/**
 * Gestiona la sesión del profe (host) con dos vías:
 *   - Google (Supabase OAuth): escucha cambios de sesión y sincroniza el perfil.
 *   - Correo + contraseña: token propio del backend guardado en tokenStore.
 */
export function useAuth() {
  const navigate = useNavigate()
  const {
    session,
    hostUser,
    hostToken,
    isLoggedIn,
    isInitialized,
    setSession,
    setHostUser,
    setHostToken,
    setInitialized,
    logout,
  } = useAuthStore()

  useEffect(() => {
    // Rehidrata el token propio (login con contraseña) guardado en localStorage.
    const storedHostToken = tokenStore.getHost()
    if (storedHostToken) setHostToken(storedHostToken)

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
  }, [setSession, setHostToken, setInitialized])

  useEffect(() => {
    if ((session || hostToken) && !hostUser) {
      authService
        .me()
        .then(setHostUser)
        .catch(() => toast.error(MESSAGES.generic.networkError))
    }
  }, [session, hostToken, hostUser, setHostUser])

  const login = useCallback(async () => {
    try {
      await loginWithGoogle()
    } catch {
      toast.error(MESSAGES.auth.loginError)
    }
  }, [])

  const loginWithPassword = useCallback(
    async (payload: ProfeLoginPayload) => {
      const res = await authService.loginProfe(payload)
      setHostToken(res.access_token)
      setHostUser(res.user)
      toast.success(MESSAGES.auth.loginSuccess)
      navigate('/dashboard')
    },
    [navigate, setHostToken, setHostUser],
  )

  const register = useCallback(
    async (payload: ProfeRegisterPayload) => {
      const res = await authService.registerProfe(payload)
      setHostToken(res.access_token)
      setHostUser(res.user)
      toast.success(MESSAGES.auth.registerSuccess)
      navigate('/dashboard')
    },
    [navigate, setHostToken, setHostUser],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    tokenStore.clearHost()
    logout()
    toast.success(MESSAGES.auth.logoutSuccess)
    navigate('/login')
  }, [logout, navigate])

  return {
    session,
    hostUser,
    isLoggedIn,
    isInitialized,
    login,
    loginWithPassword,
    register,
    logout: signOut,
  }
}
