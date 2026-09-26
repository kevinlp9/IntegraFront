import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type {
  CreateExpositionPayload,
  CreateRoomPayload,
  CreateRubricPayload,
  Exposition,
  Room,
  RubricCriteria,
} from '@/types'

export const roomService = {
  async list(): Promise<Room[]> {
    const { data } = await api.get<Room[]>(ENDPOINTS.rooms.list)
    return data
  },

  async create(payload: CreateRoomPayload): Promise<Room> {
    const { data } = await api.post<Room>(ENDPOINTS.rooms.create, payload)
    return data
  },

  async detail(id: string): Promise<Room> {
    const { data } = await api.get<Room>(ENDPOINTS.rooms.detail(id))
    return data
  },

  async update(id: string, payload: Partial<CreateRoomPayload>): Promise<Room> {
    const { data } = await api.put<Room>(ENDPOINTS.rooms.update(id), payload)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(ENDPOINTS.rooms.delete(id))
  },

  async activateTeam(id: string, teamId: string): Promise<void> {
    await api.put(ENDPOINTS.rooms.activateTeam(id, teamId))
  },

  async joinByCode(joinCode: string): Promise<Room> {
    const { data } = await api.get<Room>(ENDPOINTS.rooms.joinByCode(joinCode))
    return data
  },

  // Rubrics
  async createRubric(
    roomId: string,
    payload: CreateRubricPayload,
  ): Promise<RubricCriteria> {
    const { data } = await api.post<RubricCriteria>(
      ENDPOINTS.rubrics.create(roomId),
      payload,
    )
    return data
  },

  async listRubrics(roomId: string): Promise<RubricCriteria[]> {
    const { data } = await api.get<RubricCriteria[]>(
      ENDPOINTS.rubrics.list(roomId),
    )
    return data
  },

  async deleteRubric(id: string): Promise<void> {
    await api.delete(ENDPOINTS.rubrics.delete(id))
  },

  // Expositions
  async createExposition(
    roomId: string,
    payload: CreateExpositionPayload,
  ): Promise<Exposition> {
    const { data } = await api.post<Exposition>(
      ENDPOINTS.expositions.create(roomId),
      payload,
    )
    return data
  },

  async listExpositions(roomId: string): Promise<Exposition[]> {
    const { data } = await api.get<Exposition[]>(
      ENDPOINTS.expositions.list(roomId),
    )
    return data
  },

  async updateExposition(
    id: string,
    payload: Partial<CreateExpositionPayload>,
  ): Promise<Exposition> {
    const { data } = await api.put<Exposition>(
      ENDPOINTS.expositions.update(id),
      payload,
    )
    return data
  },

  async deleteExposition(id: string): Promise<void> {
    await api.delete(ENDPOINTS.expositions.delete(id))
  },
}
