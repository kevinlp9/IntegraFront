export interface CriteriaScore {
  criteriaId: string
  criteriaName: string
  maxScore: number
  score: number
}

export interface Evaluation {
  criteriaId: string
  score: number
}

export interface EvaluationDraft extends Evaluation {
  criteriaName: string
  maxScore: number
}

export interface SubmitEvaluationPayload {
  expositionId: string
  evaluatorName: string
  scores: Evaluation[]
  comment?: string
}

export interface ExpositionReport {
  expositionId: string
  teamName: string
  topic?: string
  averageScore: number
  maxPossibleScore: number
  evaluatorsCount: number
  totalStudents: number
  criteriaBreakdown: CriteriaScore[]
  teacherFeedback?: string
}

export interface RoomReport {
  roomId: string
  roomName: string
  joinCode: string
  expositions: ExpositionReport[]
}
