export type RoomStatus = 'draft' | 'active' | 'closed'
export type ExpositionStatus = 'pending' | 'active' | 'completed'

export interface Room {
  id: string
  name: string
  description?: string
  joinCode: string
  teacherId: string
  status: RoomStatus
  studentsCount?: number
  createdAt: string
  updatedAt?: string
}

export interface RubricCriteria {
  id: string
  roomId: string
  name: string
  maxScore: number
  description?: string
}

export interface Exposition {
  id: string
  roomId: string
  teamName: string
  topic?: string
  status: ExpositionStatus
  averageScore?: number
  evaluatorsCount?: number
}

export interface CreateRoomPayload {
  name: string
  description?: string
}

export interface CreateRubricPayload {
  name: string
  maxScore: number
  description?: string
}

export interface CreateExpositionPayload {
  teamName: string
  topic?: string
}
