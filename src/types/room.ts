export type RoomStatus = 'waiting' | 'active' | 'finished'
export type QuestionType =
  | 'rating'
  | 'multiple_choice'
  | 'true_false'
  | 'open_text'

export interface Room {
  id: number
  teacher_id: string
  name: string
  join_code: string
  status: RoomStatus
  current_exposition_id: number | null
  created_at: string
}

export interface RubricCriterion {
  id: number
  room_id: number
  name: string
  question_type: QuestionType
  max_score: number
  options: string[] | null
  /** Only present on host routes, never returned by /join. */
  correct_answer?: string | null
}

export interface Exposition {
  id: number
  room_id: number
  name: string
  order: number
  final_score: number | null
}

export interface RoomJoinResponse {
  room_id: number
  room_name: string
  room_status: RoomStatus
  is_exposition_active: boolean
  current_exposition: Exposition | null
  /** Rubric without correct_answer (public shape). */
  rubric: RubricCriterion[]
}

export interface CriterionAverage {
  criteria_id: number
  name: string
  max_score: number
  average_score: number
  total_votes: number
}

export interface ExpositionReport {
  exposition_id: number
  name: string
  order: number
  final_score: number | null
  /** 1 = first place. */
  position: number | null
  criteria_breakdown: CriterionAverage[]
}

export interface RoomReport {
  room_id: number
  room_name: string
  room_status: RoomStatus
  /** Already ordered as ranking. */
  expositions: ExpositionReport[]
}

export interface RubricCriterionCreate {
  name: string
  question_type: QuestionType
  max_score?: number
  /** Required (min 2) if question_type = "multiple_choice". */
  options?: string[]
  /** Required if multiple_choice (must be in options) or true_false ("true"/"false"). */
  correct_answer?: string
}

export interface CreateExpositionPayload {
  name: string
  order?: number
}

export interface CreateRoomPayload {
  name: string
}

export interface EvaluationScoreInput {
  criteria_id: number
  score_given?: number
  selected_option?: string
  text_answer?: string
}

export interface EvaluationSubmit {
  join_code: string
  evaluator_name: string
  scores: EvaluationScoreInput[]
}

export interface EvaluationSubmitResponse {
  message: string
  count: number
}
