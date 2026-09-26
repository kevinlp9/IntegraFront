export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  rooms: {
    list: '/rooms',
    create: '/rooms',
    detail: (id: string) => `/rooms/${id}`,
    update: (id: string) => `/rooms/${id}`,
    delete: (id: string) => `/rooms/${id}`,
    activateTeam: (id: string, teamId: string) =>
      `/rooms/${id}/activate-team/${teamId}`,
    joinByCode: (joinCode: string) => `/rooms/join/${joinCode}`,
    report: (id: string) => `/rooms/${id}/report`,
  },
  rubrics: {
    create: (roomId: string) => `/rooms/${roomId}/rubric`,
    list: (roomId: string) => `/rooms/${roomId}/rubrics`,
    delete: (id: string) => `/rubric/${id}`,
  },
  expositions: {
    create: (roomId: string) => `/rooms/${roomId}/expositions`,
    list: (roomId: string) => `/rooms/${roomId}/expositions`,
    update: (id: string) => `/expositions/${id}`,
    delete: (id: string) => `/expositions/${id}`,
  },
  evaluations: {
    submit: '/evaluations/submit',
  },
} as const
