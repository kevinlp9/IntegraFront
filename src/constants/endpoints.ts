const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined

if (!rawApiUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_API_URL no está definida. Configúrala en producción (Render, etc).',
  )
}

/** Base URL of the backend API. Always set VITE_API_URL explicitly in production. */
export const API_BASE_URL = (rawApiUrl as string).replace(/\/$/, '')

export const ENDPOINTS = {
  auth: {
    me: '/api/auth/me',
    register: '/api/auth/register',
    login: '/api/auth/login',
    alumnoRegister: '/api/auth/alumno/register',
    alumnoLogin: '/api/auth/alumno/login',
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
    enroll: (joinCode: string) => `/api/rooms/join/${joinCode}`,
    myRooms: '/api/rooms/mis-salas',
  },
  grupos: {
    create: '/api/grupos',
    list: '/api/grupos',
    detail: (grupoId: number) => `/api/grupos/${grupoId}`,
    update: (grupoId: number) => `/api/grupos/${grupoId}`,
    roster: (grupoId: number) => `/api/grupos/${grupoId}/roster`,
    profeGrade: (grupoId: number) => `/api/grupos/${grupoId}/profe-grade`,
    claims: (grupoId: number) => `/api/grupos/${grupoId}/claims`,
    rooms: (grupoId: number) => `/api/grupos/${grupoId}/rooms`,
    accumulated: (grupoId: number) => `/api/grupos/${grupoId}/accumulated`,
    myHistory: (grupoId: number) => `/api/grupos/${grupoId}/mi-historial`,
  },
  evaluations: {
    submit: '/api/evaluations/submit',
  },
} as const
