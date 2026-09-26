import { LogIn } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

/** Host login page: single "Continue with Google" action via Supabase Auth. */
export default function LoginPage() {
  const { login } = useAuth()

  return (
    <AuthLayout
      title="Bienvenido, Host"
      subtitle="Crea salas y evalúa en vivo, estilo Kahoot"
    >
      <Button fullWidth size="lg" onClick={login}>
        <LogIn className="h-5 w-5" />
        Continuar con Google
      </Button>
      <p className="mt-6 text-center text-body-sm text-text-secondary">
        ¿Eres participante?{' '}
        <a href="/join" className="font-semibold text-primary-300">
          Únete a una sala
        </a>
      </p>
    </AuthLayout>
  )
}
