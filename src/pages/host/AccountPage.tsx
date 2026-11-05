import { useState } from 'react'
import type { FormEvent } from 'react'
import { KeyRound, Mail } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { useNotification } from '@/hooks/useNotification'

/** Gestión de cuenta del profesor: actualizar correo y cambiar contraseña. */
export default function AccountPage() {
  const notify = useNotification()
  const hostUser = useAuthStore((s) => s.hostUser)
  const setHostUser = useAuthStore((s) => s.setHostUser)

  const [email, setEmail] = useState(hostUser?.email ?? '')
  const [savingEmail, setSavingEmail] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSavingEmail(true)
    try {
      const updated = await authService.updateProfeProfile({ email: email.trim() })
      setHostUser(updated)
      notify.success('Correo actualizado')
    } catch (err) {
      notify.error(
        err instanceof Error ? err.message : 'No se pudo actualizar el correo',
      )
    } finally {
      setSavingEmail(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
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
      await authService.changeProfePassword({
        current_password: currentPassword || undefined,
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
    <MainLayout>
      <div className="mx-auto max-w-xl space-y-6">
        <header>
          <h1 className="font-display text-h2 text-text-primary">Mi cuenta</h1>
          <p className="mt-1 text-body-sm text-text-secondary">
            Administra tu correo y tu contraseña de acceso.
          </p>
        </header>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-300" />
            <h2 className="text-h3 text-text-primary">Correo</h2>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" isLoading={savingEmail}>
              Guardar correo
            </Button>
          </form>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary-300" />
            <h2 className="text-h3 text-text-primary">Contraseña</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              helperText="Déjalo vacío si iniciaste sesión con Google y aún no tienes contraseña."
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
            <Button type="submit" isLoading={savingPassword}>
              Cambiar contraseña
            </Button>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
