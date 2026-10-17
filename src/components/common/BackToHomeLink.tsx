import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

/** Enlace reutilizable para volver a la página de inicio desde las pantallas de auth. */
export function BackToHomeLink() {
  return (
    <Link
      to="/"
      className="mt-4 flex w-full items-center justify-center gap-1.5 text-body-sm text-text-secondary hover:text-text-primary"
    >
      <Home className="h-4 w-4" />
      Volver al inicio
    </Link>
  )
}
