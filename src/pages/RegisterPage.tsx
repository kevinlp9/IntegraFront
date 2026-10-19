import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Presentation, UserPlus } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { BackToHomeLink } from '@/components/common/BackToHomeLink'
import { useAuth } from '@/hooks/useAuth'
import { useAlumnoAuth } from '@/hooks/useAlumnoAuth'
import { useNotification } from '@/hooks/useNotification'
import {
  isRequired,
  isValidBoleta,
  isValidEmail,
  isValidPassword,
} from '@/utils/validators'

type Role = 'alumno' | 'profesor'

/**
 * Registro unificado: un solo formulario con un selector de rol (Alumno / Profesor).
 *   - Alumno: boleta + nombre + correo + contraseña.
 *   - Profesor: correo + contraseña.
 */
export default function RegisterPage() {
  const [role, setRole] = useState<Role>('alumno')
  const notify = useNotification()

  const { register: registerProfesor } = useAuth()
  const { register: registerAlumno } = useAlumnoAuth()

  const [boleta, setBoleta] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{
    boleta?: string
    nombre?: string
    email?: string
    password?: string
    confirm?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const switchRole = (next: Role) => {
    setRole(next)
    setErrors({})
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}

    if (isAlumno) {
      if (!isValidBoleta(boleta)) nextErrors.boleta = 'Boleta inválida (solo dígitos).'
      if (!isRequired(nombre)) nextErrors.nombre = 'Tu nombre es obligatorio.'
    }
    if (!isValidEmail(email)) nextErrors.email = 'Correo inválido.'
    if (!isValidPassword(password)) nextErrors.password = 'Mínimo 6 caracteres.'
    if (password !== confirm) nextErrors.confirm = 'Las contraseñas no coinciden.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      if (isAlumno) {
        await registerAlumno({
          boleta: boleta.trim(),
          email: email.trim().toLowerCase(),
          nombre: nombre.trim(),
          password,
        })
      } else {
        await registerProfesor({ email: email.trim().toLowerCase(), password })
      }
    } catch (err) {
      notify.error((err as Error).message || 'No se pudo crear la cuenta.')
    } finally {
      setIsLoading(false)
    }
  }

  const isAlumno = role === 'alumno'

  return (
    <AuthLayout
      title="Crear cuenta"
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
        {isAlumno && (
          <>
            <Input
              label="Boleta"
              placeholder="Ej: 2021630123"
              value={boleta}
              onChange={(e) => setBoleta(e.target.value)}
              error={errors.boleta}
              inputMode="numeric"
            />
            <Input
              label="Nombre completo"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={errors.nombre}
              autoComplete="name"
            />
          </>
        )}
        <Input
          label="Correo"
          type="email"
          placeholder={isAlumno ? 'alumno@ejemplo.com' : 'profe@ejemplo.com'}
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
          {isAlumno ? 'Crear cuenta de alumno' : 'Crear cuenta de profesor'}
        </Button>
      </form>

      <p className="mt-6 text-center text-body-sm text-text-secondary">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-primary-300">
          Inicia sesión
        </Link>
      </p>
      <BackToHomeLink />
    </AuthLayout>
  )
}
