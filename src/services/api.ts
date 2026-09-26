import { API_BASE_URL } from '@/constants/endpoints'
import { getAccessToken } from './supabase'
import type { ApiErrorPayload } from '@/types'

function extractErrorMessage(payload: ApiErrorPayload | undefined, fallback: string) {
  if (!payload?.detail) return fallback
  if (typeof payload.detail === 'string') return payload.detail
  return payload.detail.map((d) => d.msg).join(', ')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken()
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

/** Thin fetch-based HTTP client that automatically attaches the Supabase JWT. */
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
}
