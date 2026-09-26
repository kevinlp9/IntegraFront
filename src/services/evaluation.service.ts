import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type {
  EvaluationSubmit,
  EvaluationSubmitResponse,
  RoomJoinResponse,
} from '@/types'

/** Public participant-facing service. Never requires authentication. */
export const evaluationService = {
  async joinByCode(joinCode: string): Promise<RoomJoinResponse> {
    return api.get<RoomJoinResponse>(ENDPOINTS.rooms.joinByCode(joinCode))
  },

  async submit(payload: EvaluationSubmit): Promise<EvaluationSubmitResponse> {
    return api.post<EvaluationSubmitResponse>(
      ENDPOINTS.evaluations.submit,
      payload,
    )
  },
}
