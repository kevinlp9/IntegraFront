import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { Navbar } from '@/components/common/Navbar'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

/** App header showing the current user and a logout action. */
export function Header() {
  const { user, logout } = useAuth()

  return (
    <Navbar>
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-body-sm font-medium text-gray-900 dark:text-gray-50">
              {user.name}
            </p>
            <p className="text-caption text-gray-500">
              {user.role === 'teacher' ? 'Profesor' : 'Alumno'}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Salir
          </Button>
        </div>
      )}
    </Navbar>
  )
}
