import { LogOut } from 'lucide-react'
import { Navbar } from '@/components/common/Navbar'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

/** App header showing the current host and a logout action. */
export function Header() {
  const { hostUser, logout } = useAuth()

  return (
    <Navbar>
      {hostUser && (
        <div className="flex items-center gap-3">
          <p className="hidden text-body-sm text-text-secondary sm:block">
            {hostUser.email}
          </p>
          <Button variant="secondary" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      )}
    </Navbar>
  )
}
