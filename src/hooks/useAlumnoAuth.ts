import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import { tokenStore } from '@/services/token'
import { useAlumnoStore } from '@/store/alumnoStore'
import { useParticipantStore } from '@/store/participantStore'
import { MESSAGES } from '@/constants/messages'
import type { AlumnoLoginPayload, AlumnoRegisterPayload } from '@/types'

/**
 * Gestiona la sesión del alumno evaluador:
 *   - Registro: boleta + correo + nombre + contraseña.
 *   - Login: boleta + contraseña.
 * Tras autenticarse, redirige a /join para entrar a una sala.
 */
export function useAlumnoAuth() {
  const navigate = useNavigate()
  const { alumno, isLoggedIn, setAlumno, logout } = useAlumnoStore()
  const resetParticipant = useParticipantStore((s) => s.reset)

  const login = useCallback(
    async (payload: AlumnoLoginPayload) => {
      const res = await authService.loginAlumno(payload)
      setAlumno(res.alumno)
      toast.success(MESSAGES.auth.loginSuccess)
      navigate('/join')
    },
    [navigate, setAlumno],
  )

  const register = useCallback(
    async (payload: AlumnoRegisterPayload) => {
      const res = await authService.registerAlumno(payload)
      setAlumno(res.alumno)
      toast.success(MESSAGES.auth.registerSuccess)
      navigate('/join')
    },
    [navigate, setAlumno],
  )

  const signOut = useCallback(() => {
    tokenStore.clearAlumno()
    resetParticipant()
    logout()
    toast.success(MESSAGES.auth.logoutSuccess)
    navigate('/alumno/login')
  }, [logout, navigate, resetParticipant])

  return { alumno, isLoggedIn, login, register, logout: signOut }
}
