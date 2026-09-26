import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import {
  isRequired,
  isValidEmail,
  isValidPassword,
} from '@/utils/validators'

interface FormErrors {
  name?: string
  email?: string
  password?: string
}

/** Signup page for teachers to create an account. */
export default function SignupPage() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: FormErrors = {}
    if (!isRequired(name)) nextErrors.name = 'El nombre es obligatorio.'
    if (!isValidEmail(email)) nextErrors.email = 'Correo inválido.'
    if (!isValidPassword(password))
      nextErrors.password = 'Mínimo 6 caracteres.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsLoading(true)
    try {
      await signup({ name: name.trim(), email, password })
    } catch {
      // toast handled inside useAuth
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Crear Cuenta" subtitle="Regístrate como profesor">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          placeholder="Ej: Dra. María López"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
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
          Crear Cuenta
        </Button>
      </form>
      <p className="mt-6 text-center text-body-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-primary-700">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  )
}
