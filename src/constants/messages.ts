export const MESSAGES = {
  auth: {
    loginSuccess: 'Bienvenido de nuevo 👋',
    loginError: 'Credenciales inválidas. Intenta de nuevo.',
    signupSuccess: 'Cuenta creada exitosamente 🎉',
    signupError: 'No se pudo crear la cuenta.',
    logoutSuccess: 'Sesión cerrada correctamente.',
    sessionExpired: 'Tu sesión ha expirado, inicia sesión de nuevo.',
  },
  room: {
    createSuccess: 'Sala creada exitosamente 🎉',
    createError: 'No se pudo crear la sala.',
    updateSuccess: 'Sala actualizada.',
    deleteSuccess: 'Sala eliminada.',
    joinError: 'Código de sala inválido o sala no encontrada.',
    joinSuccess: '¡Te uniste a la sala!',
    activateTeamSuccess: 'Equipo activado correctamente.',
  },
  rubric: {
    createSuccess: 'Criterio agregado.',
    deleteSuccess: 'Criterio eliminado.',
    createError: 'No se pudo agregar el criterio.',
  },
  exposition: {
    createSuccess: 'Equipo registrado.',
    updateSuccess: 'Equipo actualizado.',
    deleteSuccess: 'Equipo eliminado.',
  },
  evaluation: {
    submitSuccess: 'Evaluación guardada ✅',
    submitError: 'No se pudo enviar la evaluación.',
    incomplete: 'Completa todos los criterios antes de enviar.',
  },
  generic: {
    error: 'Algo salió mal. Intenta de nuevo.',
    networkError: 'Error de conexión con el servidor.',
    loading: 'Cargando...',
  },
} as const
