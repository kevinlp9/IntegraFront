import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { MESSAGES } from '@/constants/messages'
import type { LoginCredentials, SignupPayload } from '@/types'

/** Encapsulates login/signup/logout flows and exposes current auth state. */
export function useAuth() {
  const navigate = useNavigate()
  const { user, token, isLoggedIn, setSession, logout: clearSession } =
    useAuthStore()

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const { user: loggedUser, token: authToken } =
          await authService.login(credentials)
        setSession(loggedUser, authToken)
        toast.success(MESSAGES.auth.loginSuccess)
        navigate(
          loggedUser.role === 'teacher' ? '/teacher/dashboard' : '/student',
        )
        return loggedUser
      } catch {
        toast.error(MESSAGES.auth.loginError)
        throw new Error(MESSAGES.auth.loginError)
      }
    },
    [navigate, setSession],
  )

  const signup = useCallback(
    async (payload: SignupPayload) => {
      try {
        const { user: newUser, token: authToken } =
          await authService.signup(payload)
        setSession(newUser, authToken)
        toast.success(MESSAGES.auth.signupSuccess)
        navigate('/teacher/dashboard')
        return newUser
      } catch {
        toast.error(MESSAGES.auth.signupError)
        throw new Error(MESSAGES.auth.signupError)
      }
    },
    [navigate, setSession],
  )

  const logout = useCallback(() => {
    clearSession()
    toast.success(MESSAGES.auth.logoutSuccess)
    navigate('/login')
  }, [clearSession, navigate])

  return { user, token, isLoggedIn, login, signup, logout }
}
