import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type {
  AccumulatedReport,
  ClaimReview,
  CreateGrupoPayload,
  Grupo,
  ProfeGradeUpdate,
  Room,
  RosterRow,
  RosterUpload,
  StudentHistory,
  UpdateGrupoPayload,
} from '@/types'

/** Servicio de Grupos/Clases (estilo Classroom). Requiere sesión de profe. */
export const grupoService = {
  async create(payload: CreateGrupoPayload): Promise<Grupo> {
    return api.post<Grupo>(ENDPOINTS.grupos.create, payload, 'host')
  },

  async list(): Promise<Grupo[]> {
    return api.get<Grupo[]>(ENDPOINTS.grupos.list, 'host')
  },

  async get(grupoId: number): Promise<Grupo> {
    return api.get<Grupo>(ENDPOINTS.grupos.detail(grupoId), 'host')
  },

  async update(grupoId: number, payload: UpdateGrupoPayload): Promise<Grupo> {
    return api.put<Grupo>(ENDPOINTS.grupos.update(grupoId), payload, 'host')
  },

  async setRoster(grupoId: number, payload: RosterUpload): Promise<RosterRow[]> {
    return api.put<RosterRow[]>(ENDPOINTS.grupos.roster(grupoId), payload, 'host')
  },

  async listRoster(grupoId: number): Promise<RosterRow[]> {
    return api.get<RosterRow[]>(ENDPOINTS.grupos.roster(grupoId), 'host')
  },

  async setProfeGrade(
    grupoId: number,
    payload: ProfeGradeUpdate,
  ): Promise<RosterRow> {
    return api.put<RosterRow>(ENDPOINTS.grupos.profeGrade(grupoId), payload, 'host')
  },

  /** El profe aprueba/rechaza/reinicia el reclamo de una boleta. */
  async reviewClaim(grupoId: number, payload: ClaimReview): Promise<RosterRow> {
    return api.put<RosterRow>(ENDPOINTS.grupos.claims(grupoId), payload, 'host')
  },

  async listRooms(grupoId: number): Promise<Room[]> {
    return api.get<Room[]>(ENDPOINTS.grupos.rooms(grupoId), 'host')
  },

  async accumulated(grupoId: number): Promise<AccumulatedReport> {
    return api.get<AccumulatedReport>(ENDPOINTS.grupos.accumulated(grupoId), 'host')
  },

  /** Historial del alumno autenticado dentro del grupo (feedback por evento). */
  async myHistory(grupoId: number): Promise<StudentHistory> {
    return api.get<StudentHistory>(ENDPOINTS.grupos.myHistory(grupoId), 'alumno')
  },
}
