/**
 * Almacenamiento de los tokens de acceso emitidos por el backend propio.
 * Se guardan dos tokens independientes porque un navegador podría usarse como
 * profe (host) o como alumno:
 *   - host:   login con correo + contraseña (además del login con Google de Supabase).
 *   - alumno: login con boleta + contraseña.
 */
const HOST_KEY = 'integra-host-token'
const ALUMNO_KEY = 'integra-alumno-token'

export const tokenStore = {
  getHost: (): string | null => localStorage.getItem(HOST_KEY),
  setHost: (token: string) => localStorage.setItem(HOST_KEY, token),
  clearHost: () => localStorage.removeItem(HOST_KEY),

  getAlumno: (): string | null => localStorage.getItem(ALUMNO_KEY),
  setAlumno: (token: string) => localStorage.setItem(ALUMNO_KEY, token),
  clearAlumno: () => localStorage.removeItem(ALUMNO_KEY),
}
