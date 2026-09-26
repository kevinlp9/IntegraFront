import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { isValidEmail, isValidPassword } from '@/utils/validators'

/** Login page for teachers and students. */
export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!isValidEmail(email)) nextErrors.email = 'Correo inválido.'
    if (!isValidPassword(password))
      nextErrors.password = 'Mínimo 6 caracteres.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      await login({ email, password })
    } catch {
      // toast handled inside useAuth
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Accede a tu cuenta de Integra"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tucorreo@universidad.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          Ingresar
        </Button>
      </form>
      <p className="mt-6 text-center text-body-sm text-gray-500">
        ¿No tienes cuenta?{' '}
        <Link to="/signup" className="font-semibold text-primary-700">
          Regístrate
        </Link>
      </p>
      <p className="mt-2 text-center text-body-sm text-gray-500">
        ¿Eres alumno?{' '}
        <Link to="/join" className="font-semibold text-primary-700">
          Únete a una sala
        </Link>
      </p>
    </AuthLayout>
  )
}
