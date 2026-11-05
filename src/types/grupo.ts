export type Period =
  | 'parcial_1'
  | 'parcial_2'
  | 'parcial_3'
  | 'extraordinario'
  | 'actividad'

export type RoomMode = 'team' | 'individual'

export const PERIOD_LABELS: Record<Period, string> = {
  parcial_1: 'Parcial 1',
  parcial_2: 'Parcial 2',
  parcial_3: 'Parcial 3',
  extraordinario: 'Extraordinario',
  actividad: 'Actividad',
}

export const MODE_LABELS: Record<RoomMode, string> = {
  team: 'Por equipo',
  individual: 'Individual',
}

export interface GradeFormula {
  parcial_1: number
  parcial_2: number
  parcial_3: number
  extraordinario: number
  profe: number
}

export interface Grupo {
  id: number
  name: string
  semester: string | null
  join_code: string
  formula: GradeFormula
  created_at: string
}

export interface CreateGrupoPayload {
  name: string
  semester?: string
  formula?: GradeFormula
}

export interface UpdateGrupoPayload {
  name?: string
  semester?: string
  formula?: GradeFormula
}

export interface RosterEntry {
  boleta: string
  nombre: string
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected'

export interface RosterRow {
  boleta: string
  nombre: string
  profe_score: number | null
  claim_status: ClaimStatus | null
  claim_email: string | null
  claimed_at: string | null
}

export interface RosterUpload {
  students: RosterEntry[]
}

export interface ProfeGradeUpdate {
  boleta: string
  profe_score: number | null
}

/** Revisión del profe sobre el reclamo de una boleta. */
export interface ClaimReview {
  boleta: string
  action: 'approve' | 'reject' | 'reset'
}

/** Confirmación de nombre + correo + contraseña de la propia cuenta al inscribirse. */
export interface GrupoJoinRequest {
  nombre: string
  password: string
  email: string
}

export interface AlumnoGrupo {
  id: number
  name: string
  semester: string | null
  join_code: string
  claim_status: ClaimStatus | null
}

export interface AccumulatedRow {
  boleta: string
  nombre: string
  parcial_1: number | null
  parcial_2: number | null
  parcial_3: number | null
  extraordinario: number | null
  profe_score: number | null
  final_average: number | null
}

export interface AccumulatedReport {
  grupo_id: number
  grupo_name: string
  formula: GradeFormula
  rows: AccumulatedRow[]
}

export interface EventCriterionScore {
  name: string
  max_score: number
  average_score: number | null
}

export interface StudentEventFeedback {
  room_id: number
  room_name: string
  period: Period
  mode: RoomMode
  status: string
  score: number | null
  criteria: EventCriterionScore[]
  feedback: string[]
}

export interface StudentHistory {
  grupo_id: number
  grupo_name: string
  events: StudentEventFeedback[]
}
