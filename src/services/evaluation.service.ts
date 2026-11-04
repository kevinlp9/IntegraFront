import { ENDPOINTS } from '@/constants/endpoints'
import { api } from './api'
import type {
  AlumnoRoomSummary,
  EvaluationSubmit,
  EvaluationSubmitResponse,
  GrupoJoinRequest,
  RoomJoinResponse,
} from '@/types'

/** Servicio del flujo de participante. Todo requiere sesión de alumno. */
export const evaluationService = {
  /** Sondeo del estado de la sala (requiere estar inscrito en ella). */
  async joinByCode(joinCode: string): Promise<RoomJoinResponse> {
    return api.get<RoomJoinResponse>(ENDPOINTS.rooms.joinByCode(joinCode), 'alumno')
  },

  /**
   * Inscribe al alumno en la sala con el código y devuelve su estado actual.
   * Si la sala pertenece a un grupo, se debe enviar `payload` (nombre +
   * contraseña de acceso) para validar contra la lista oficial del profe.
   */
  async enroll(
    joinCode: string,
    payload?: GrupoJoinRequest,
  ): Promise<RoomJoinResponse> {
    return api.post<RoomJoinResponse>(
      ENDPOINTS.rooms.enroll(joinCode),
      payload,
      'alumno',
    )
  },

  /** Lista las salas a las que el alumno ya se unió ('Mis salas'). */
  async listMyRooms(): Promise<AlumnoRoomSummary[]> {
    return api.get<AlumnoRoomSummary[]>(ENDPOINTS.rooms.myRooms, 'alumno')
  },

  async submit(payload: EvaluationSubmit): Promise<EvaluationSubmitResponse> {
    return api.post<EvaluationSubmitResponse>(
      ENDPOINTS.evaluations.submit,
      payload,
      'alumno',
    )
  },
}
