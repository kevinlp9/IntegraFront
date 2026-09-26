import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type {
  CreateExpositionPayload,
  CreateRoomPayload,
  Exposition,
  Room,
  RoomReport,
  RubricCriterion,
  RubricCriterionCreate,
} from '@/types'

/** Host-side room service. All calls require a valid Supabase JWT. */
export const roomService = {
  async create(payload: CreateRoomPayload): Promise<Room> {
    return api.post<Room>(ENDPOINTS.rooms.create, payload)
  },

  async list(): Promise<Room[]> {
    return api.get<Room[]>(ENDPOINTS.rooms.list)
  },

  async createRubric(
    roomId: number,
    payload: RubricCriterionCreate,
  ): Promise<RubricCriterion> {
    return api.post<RubricCriterion>(ENDPOINTS.rooms.rubric(roomId), payload)
  },

  async listRubric(roomId: number): Promise<RubricCriterion[]> {
    return api.get<RubricCriterion[]>(ENDPOINTS.rooms.rubric(roomId))
  },

  async createExposition(
    roomId: number,
    payload: CreateExpositionPayload,
  ): Promise<Exposition> {
    return api.post<Exposition>(ENDPOINTS.rooms.expositions(roomId), payload)
  },

  async listExpositions(roomId: number): Promise<Exposition[]> {
    return api.get<Exposition[]>(ENDPOINTS.rooms.expositions(roomId))
  },

  async start(roomId: number): Promise<Room> {
    return api.put<Room>(ENDPOINTS.rooms.start(roomId))
  },

  async next(roomId: number): Promise<Room> {
    return api.put<Room>(ENDPOINTS.rooms.next(roomId))
  },

  async activate(roomId: number, expositionId: number): Promise<Room> {
    return api.put<Room>(ENDPOINTS.rooms.activate(roomId, expositionId))
  },

  async finish(roomId: number): Promise<Room> {
    return api.put<Room>(ENDPOINTS.rooms.finish(roomId))
  },

  async report(roomId: number): Promise<RoomReport> {
    return api.get<RoomReport>(ENDPOINTS.rooms.report(roomId))
  },
}
