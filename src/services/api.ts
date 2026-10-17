import { API_BASE_URL } from '@/constants/endpoints'
import { getAccessToken as getSupabaseToken } from './supabase'
import { tokenStore } from './token'
import type { ApiErrorPayload } from '@/types'

/** A qué credencial debe asociarse una petición. */
export type AuthMode = 'auto' | 'host' | 'alumno' | 'public'

function extractErrorMessage(payload: ApiErrorPayload | undefined, fallback: string) {
  if (!payload?.detail) return fallback
  if (typeof payload.detail === 'string') return payload.detail
  return payload.detail.map((d) => d.msg).join(', ')
}

/**
 * Resuelve el token a enviar según el modo:
 *   - host:   token propio del profe o, en su defecto, la sesión de Supabase (Google).
 *   - alumno: token propio del alumno.
 *   - auto:   host (propio o Supabase) y como último recurso el de alumno.
 *   - public: sin token.
 */
async function resolveToken(auth: AuthMode): Promise<string | undefined> {
  if (auth === 'public') return undefined
  if (auth === 'alumno') return tokenStore.getAlumno() ?? undefined

  const hostToken = tokenStore.getHost() ?? (await getSupabaseToken())
  if (auth === 'host') return hostToken ?? undefined

  // auto
  return hostToken ?? tokenStore.getAlumno() ?? undefined
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth: AuthMode = 'auto',
): Promise<T> {
  const token = await resolveToken(auth)
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const payload = (await res.json().catch(() => undefined)) as
      | ApiErrorPayload
      | undefined
    throw new Error(extractErrorMessage(payload, res.statusText))
  }
  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}

/** Thin fetch-based HTTP client. `auth` selecciona la credencial a adjuntar. */
export const api = {
  get: <T>(path: string, auth: AuthMode = 'auto') => request<T>(path, {}, auth),
  post: <T>(path: string, body?: unknown, auth: AuthMode = 'auto') =>
    request<T>(
      path,
      { method: 'POST', body: body ? JSON.stringify(body) : undefined },
      auth,
    ),
  put: <T>(path: string, body?: unknown, auth: AuthMode = 'auto') =>
    request<T>(
      path,
      { method: 'PUT', body: body ? JSON.stringify(body) : undefined },
      auth,
    ),
}
