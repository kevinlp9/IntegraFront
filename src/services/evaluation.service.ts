import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type { RoomReport, SubmitEvaluationPayload } from '@/types'

export const evaluationService = {
  async submit(payload: SubmitEvaluationPayload): Promise<void> {
    await api.post(ENDPOINTS.evaluations.submit, payload)
  },

  async getReport(roomId: string): Promise<RoomReport> {
    const { data } = await api.get<RoomReport>(ENDPOINTS.rooms.report(roomId))
    return data
  },
}
