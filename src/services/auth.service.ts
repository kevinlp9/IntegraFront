import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import { tokenStore } from './token'
import type {
  AlumnoLoginPayload,
  AlumnoProfileUpdatePayload,
  AlumnoRegisterPayload,
  AlumnoTokenResponse,
  AlumnoUser,
  HostTokenResponse,
  HostUser,
  PasswordChangePayload,
  ProfeLoginPayload,
  ProfeProfileUpdatePayload,
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

  // --- Gestión de cuenta ---

  /** Actualiza el correo del profe autenticado. */
  async updateProfeProfile(payload: ProfeProfileUpdatePayload): Promise<HostUser> {
    return api.put<HostUser>(ENDPOINTS.auth.profile, payload, 'host')
  },

  /** Cambia la contraseña del profe autenticado. */
  async changeProfePassword(payload: PasswordChangePayload): Promise<void> {
    await api.put<null>(ENDPOINTS.auth.password, payload, 'host')
  },

  /** Devuelve el perfil del alumno autenticado. */
  async alumnoMe(): Promise<AlumnoUser> {
    return api.get<AlumnoUser>(ENDPOINTS.auth.alumnoMe, 'alumno')
  },

  /** Actualiza el nombre y correo del alumno autenticado. */
  async updateAlumnoProfile(payload: AlumnoProfileUpdatePayload): Promise<AlumnoUser> {
    return api.put<AlumnoUser>(ENDPOINTS.auth.alumnoProfile, payload, 'alumno')
  },

  /** Cambia la contraseña del alumno autenticado. */
  async changeAlumnoPassword(payload: PasswordChangePayload): Promise<void> {
    await api.put<null>(ENDPOINTS.auth.alumnoPassword, payload, 'alumno')
  },
}

