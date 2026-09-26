const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined

if (!rawApiUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_API_URL no está definida. Usando http://localhost:8000 como ' +
      'fallback de desarrollo. Configúrala en producción (Render, etc).',
  )
}

/** Base URL of the backend API. Always set VITE_API_URL explicitly in production. */
export const API_BASE_URL = (rawApiUrl ?? 'http://localhost:8000').replace(/\/$/, '')

export const ENDPOINTS = {
  auth: {
    me: '/api/auth/me',
  },
  rooms: {
    create: '/api/rooms',
    list: '/api/rooms',
    rubric: (roomId: number) => `/api/rooms/${roomId}/rubric`,
    expositions: (roomId: number) => `/api/rooms/${roomId}/expositions`,
    start: (roomId: number) => `/api/rooms/${roomId}/start`,
    next: (roomId: number) => `/api/rooms/${roomId}/next`,
    activate: (roomId: number, expositionId: number) =>
      `/api/rooms/${roomId}/activate/${expositionId}`,
    finish: (roomId: number) => `/api/rooms/${roomId}/finish`,
    report: (roomId: number) => `/api/rooms/${roomId}/report`,
    joinByCode: (joinCode: string) => `/api/rooms/join/${joinCode}`,
  },
  evaluations: {
    submit: '/api/evaluations/submit',
  },
} as const
