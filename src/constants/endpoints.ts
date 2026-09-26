export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

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
