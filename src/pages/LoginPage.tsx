import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, LogIn, Presentation } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { BackToHomeLink } from '@/components/common/BackToHomeLink'
import { useAuth } from '@/hooks/useAuth'
import { useAlumnoAuth } from '@/hooks/useAlumnoAuth'
import { useNotification } from '@/hooks/useNotification'
import { isValidBoleta, isValidEmail, isValidPassword } from '@/utils/validators'

type Role = 'alumno' | 'profesor'

/**
 * Login unificado: un solo formulario con un selector de rol (Alumno / Profesor).
 *   - Alumno: boleta + contraseña.
 *   - Profesor: correo + contraseña (o "Continuar con Google").
 */
export default function LoginPage() {
  const [role, setRole] = useState<Role>('alumno')
  const notify = useNotification()

  const { login: loginGoogle, loginWithPassword } = useAuth()
  const { login: loginAlumno } = useAlumnoAuth()

  const [boleta, setBoleta] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    boleta?: string
    email?: string
    password?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const switchRole = (next: Role) => {
    setRole(next)
    setErrors({})
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}

    if (role === 'alumno') {
      if (!isValidBoleta(boleta)) nextErrors.boleta = 'Boleta inválida (solo dígitos).'
    } else {
      if (!isValidEmail(email)) nextErrors.email = 'Correo inválido.'
    }
    if (!isValidPassword(password)) nextErrors.password = 'Mínimo 6 caracteres.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      if (role === 'alumno') {
        await loginAlumno({ boleta: boleta.trim(), password })
      } else {
        await loginWithPassword({ email: email.trim().toLowerCase(), password })
      }
    } catch (err) {
      notify.error((err as Error).message || 'No se pudo iniciar sesión.')
    } finally {
      setIsLoading(false)
    }
  }

  const isAlumno = role === 'alumno'

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Elige cómo quieres entrar a la plataforma"
    >
      {/* Selector de rol */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => switchRole('alumno')}
          className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-body-sm font-semibold transition ${
            isAlumno
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Alumno
        </button>
        <button
          type="button"
          onClick={() => switchRole('profesor')}
          className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-body-sm font-semibold transition ${
            !isAlumno
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Presentation className="h-4 w-4" />
          Profesor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isAlumno ? (
          <Input
            label="Boleta"
            placeholder="Ej: 2021630123"
            value={boleta}
            onChange={(e) => setBoleta(e.target.value)}
            error={errors.boleta}
            inputMode="numeric"
            autoComplete="username"
          />
        ) : (
          <Input
            label="Correo"
            type="email"
            placeholder="profe@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
        )}
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          <LogIn className="h-5 w-5" />
          {isAlumno ? 'Entrar como alumno' : 'Entrar como profesor'}
        </Button>
      </form>

      {!isAlumno && (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-caption text-text-secondary">o</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <Button variant="secondary" fullWidth size="lg" onClick={loginGoogle}>
            <LogIn className="h-5 w-5" />
            Continuar con Google
          </Button>
        </>
      )}

      <p className="mt-6 text-center text-body-sm text-text-secondary">
        {isAlumno ? (
          <>
            ¿Eres alumno y no tienes cuenta?{' '}
            <Link to="/alumno/register" className="font-semibold text-primary-300">
              Regístrate como alumno
            </Link>
          </>
        ) : (
          <>
            ¿Eres profesor y no tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-primary-300">
              Regístrate como profesor
            </Link>
          </>
        )}
      </p>
      <BackToHomeLink />
    </AuthLayout>
  )
}
