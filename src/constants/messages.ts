export const MESSAGES = {
  auth: {
    loginError: 'No se pudo iniciar sesión con Google.',
    logoutSuccess: 'Sesión cerrada correctamente.',
  },
  room: {
    createSuccess: 'Sala creada exitosamente 🎉',
    createError: 'No se pudo crear la sala.',
    joinError: 'Código de sala inválido o sala no encontrada.',
    joinSuccess: '¡Te uniste a la sala!',
    startSuccess: '¡Sala iniciada!',
    nextSuccess: 'Avanzando al siguiente elemento…',
    finishSuccess: 'Sala finalizada. Puntajes congelados.',
    activateSuccess: 'Elemento activado.',
    noActiveExposition: 'La sala aún no tiene ningún elemento activo.',
  },
  rubric: {
    createSuccess: 'Pregunta agregada.',
    createError: 'No se pudo agregar la pregunta.',
  },
  exposition: {
    createSuccess: 'Elemento registrado.',
    createError: 'No se pudo registrar el elemento.',
  },
  evaluation: {
    submitSuccess: '¡Respuesta enviada! ✅',
    submitError: 'No se pudo enviar tu respuesta.',
    incomplete: 'Responde todas las preguntas antes de enviar.',
  },
  generic: {
    error: 'Algo salió mal. Intenta de nuevo.',
    networkError: 'Error de conexión con el servidor.',
    loading: 'Cargando...',
    copied: 'Código copiado al portapapeles.',
  },
} as const
