export * from './auth'
export * from './room'
export * from './grupo'

export interface ApiErrorPayload {
  detail:
    | string
    | Array<{ loc: (string | number)[]; msg: string; type: string }>
}
