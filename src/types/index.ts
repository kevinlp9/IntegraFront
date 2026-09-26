export * from './auth'
export * from './room'

export interface ApiErrorPayload {
  detail:
    | string
    | Array<{ loc: (string | number)[]; msg: string; type: string }>
}
