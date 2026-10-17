import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import { tokenStore } from './token'
import type {
  AlumnoLoginPayload,
  AlumnoRegisterPayload,
  AlumnoTokenResponse,
  HostTokenResponse,
  HostUser,
  ProfeLoginPayload,
  ProfeRegisterPayload,
} from '@/types'

export const authService = {
  /** Syncs the backend-authenticated host; call once after login. */
  async me(): Promise<HostUser> {
    return api.get<HostUser>(ENDPOINTS.auth.me, 'host')
  },

  /** Registra un profe con correo + contraseña y guarda su token. */
  async registerProfe(payload: ProfeRegisterPayload): Promise<HostTokenResponse> {
    const res = await api.post<HostTokenResponse>(
      ENDPOINTS.auth.register,
      payload,
      'public',
    )
    tokenStore.setHost(res.access_token)
    return res
  },

  /** Inicia sesión de un profe con correo + contraseña y guarda su token. */
  async loginProfe(payload: ProfeLoginPayload): Promise<HostTokenResponse> {
    const res = await api.post<HostTokenResponse>(
      ENDPOINTS.auth.login,
      payload,
      'public',
    )
    tokenStore.setHost(res.access_token)
    return res
  },

  /** Registra un alumno (boleta + correo + nombre + contraseña) y guarda su token. */
  async registerAlumno(payload: AlumnoRegisterPayload): Promise<AlumnoTokenResponse> {
    const res = await api.post<AlumnoTokenResponse>(
      ENDPOINTS.auth.alumnoRegister,
      payload,
      'public',
    )
    tokenStore.setAlumno(res.access_token)
    return res
  },

  /** Inicia sesión de un alumno con boleta + contraseña y guarda su token. */
  async loginAlumno(payload: AlumnoLoginPayload): Promise<AlumnoTokenResponse> {
    const res = await api.post<AlumnoTokenResponse>(
      ENDPOINTS.auth.alumnoLogin,
      payload,
      'public',
    )
    tokenStore.setAlumno(res.access_token)
    return res
  },
}

