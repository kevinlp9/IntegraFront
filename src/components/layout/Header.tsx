import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/helpers'

const NAV_LINKS = [
  { to: '/grupos', label: 'Grupos' },
  { to: '/dashboard', label: 'Salas' },
  { to: '/cuenta', label: 'Cuenta' },
]

/** App header showing navigation, the current host and a logout action. */
export function Header() {
  const { hostUser, logout } = useAuth()

  return (
    <Navbar>
      {hostUser && (
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-1.5 text-body-sm font-semibold transition',
                    isActive
                      ? 'bg-primary-600/20 text-primary-200'
                      : 'text-text-secondary hover:text-text-primary',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <p className="hidden text-body-sm text-text-secondary md:block">
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
