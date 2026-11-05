import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { authService } from '@/services/auth.service'
import { useAlumnoStore } from '@/store/alumnoStore'
import { useNotification } from '@/hooks/useNotification'

/** Gestión de cuenta del alumno: nombre, correo y cambio de contraseña. */
export default function AlumnoAccountPage() {
  const notify = useNotification()
  const alumno = useAlumnoStore((s) => s.alumno)
  const setAlumno = useAlumnoStore((s) => s.setAlumno)

  const [nombre, setNombre] = useState(alumno?.nombre ?? '')
  const [email, setEmail] = useState(alumno?.email ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) return
    setSavingProfile(true)
    try {
      const updated = await authService.updateAlumnoProfile({
        nombre: nombre.trim(),
        email: email.trim(),
      })
      setAlumno(updated)
      notify.success('Datos actualizados')
    } catch (err) {
      notify.error(
        err instanceof Error ? err.message : 'No se pudieron actualizar tus datos',
      )
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    if (!currentPassword) {
      setPasswordError('Ingresa tu contraseña actual.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.')
      return
    }
    setSavingPassword(true)
    try {
      await authService.changeAlumnoPassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      notify.success('Contraseña actualizada')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'No se pudo cambiar la contraseña',
      )
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <AuthLayout
      title="Mi cuenta"
      subtitle={alumno ? `${alumno.nombre} (${alumno.boleta})` : undefined}
    >
      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-h3 text-text-primary">Mis datos</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" fullWidth isLoading={savingProfile}>
              Guardar datos
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-h3 text-text-primary">Contraseña</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordError ?? undefined}
            />
            <Button type="submit" fullWidth isLoading={savingPassword}>
              Cambiar contraseña
            </Button>
          </form>
        </Card>

        <Link
          to="/join"
          className="flex items-center justify-center gap-1.5 text-body-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a salas y grupos
        </Link>
      </div>
    </AuthLayout>
  )
}
