export interface HostUser {
  id: string
  email: string
}

/** Alumno evaluador autenticado (login con boleta + contraseña). */
export interface AlumnoUser {
  boleta: string
  email: string
  nombre: string
}

/** Respuesta del backend al registrar/iniciar sesión un profe con contraseña. */
export interface HostTokenResponse {
  access_token: string
  token_type: string
  user: HostUser
}

/** Respuesta del backend al registrar/iniciar sesión un alumno. */
export interface AlumnoTokenResponse {
  access_token: string
  token_type: string
  alumno: AlumnoUser
}

export interface ProfeLoginPayload {
  email: string
  password: string
}

export interface ProfeRegisterPayload {
  email: string
  password: string
}

export interface AlumnoLoginPayload {
  boleta: string
  password: string
}

export interface AlumnoRegisterPayload {
  boleta: string
  email: string
  nombre: string
  password: string
}
