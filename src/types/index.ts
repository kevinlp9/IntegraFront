export * from './auth'
export * from './room'
export * from './evaluation'

export interface ApiError {
  message: string
  statusCode?: number
  details?: unknown
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
