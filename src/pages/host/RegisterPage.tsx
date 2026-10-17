import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Presentation, UserPlus } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { BackToHomeLink } from '@/components/common/BackToHomeLink'
import { useAuth } from '@/hooks/useAuth'
import { useNotification } from '@/hooks/useNotification'
import { isValidEmail, isValidPassword } from '@/utils/validators'

/** Registro del PROFESOR con correo + contraseña. */
export default function RegisterPage() {
  const { register } = useAuth()
  const notify = useNotification()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirm?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!isValidEmail(email)) nextErrors.email = 'Correo inválido.'
    if (!isValidPassword(password)) nextErrors.password = 'Mínimo 6 caracteres.'
    if (password !== confirm) nextErrors.confirm = 'Las contraseñas no coinciden.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      await register({ email: email.trim().toLowerCase(), password })
    } catch (err) {
      notify.error((err as Error).message || 'No se pudo crear la cuenta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Crear cuenta · Profesor"
      subtitle="Regístrate con tu correo para administrar salas"
    >
      <div className="mb-6 flex items-center justify-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-body-sm font-medium text-primary-200">
        <Presentation className="h-4 w-4" />
        Registro de Profesor
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo"
          type="email"
          placeholder="profe@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          <UserPlus className="h-5 w-5" />
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-body-sm text-text-secondary">
        ¿Ya tienes cuenta de profesor?{' '}
        <Link to="/login" className="font-semibold text-primary-300">
          Inicia sesión
        </Link>
      </p>

      <BackToHomeLink />
    </AuthLayout>
  )
}
