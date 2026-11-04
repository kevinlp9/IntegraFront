import { useMemo, useState } from 'react'
import { Check, RotateCcw, Save, Users, X } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Textarea } from '@/components/common/Input'
import { Tooltip } from '@/components/common/Tooltip'
import type {
  ClaimReview,
  ClaimStatus,
  RosterEntry,
  RosterRow,
  RosterUpload,
} from '@/types'

export interface RosterPanelProps {
  roster: RosterRow[]
  isSaving: boolean
  onSave: (payload: RosterUpload) => Promise<unknown>
  onReview?: (payload: ClaimReview) => Promise<unknown>
  isReviewing?: boolean
}

const CLAIM_BADGE: Record<ClaimStatus, { label: string; className: string; help: string }> = {
  pending: {
    label: 'Por revisar',
    className: 'bg-amber-500/20 text-amber-200',
    help: 'Una cuenta reclamó esta boleta. Verifica que sea el alumno real y apruébala o recházala.',
  },
  approved: {
    label: 'Aprobado',
    className: 'bg-emerald-500/20 text-emerald-200',
    help: 'Confirmaste que esta cuenta corresponde al alumno real.',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-red-500/20 text-red-200',
    help: 'Rechazaste esta cuenta; la boleta queda bloqueada hasta reactivarla.',
  },
}

/** Parsea líneas "boleta, nombre" (o "boleta<TAB>nombre") a entradas de roster. */
function parseRoster(text: string): RosterEntry[] {
  const entries: RosterEntry[] = []
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const parts = trimmed.split(/[\t,;]+/)
    if (parts.length < 2) continue
    const boleta = parts[0].trim()
    const nombre = parts.slice(1).join(' ').trim()
    if (boleta && nombre) entries.push({ boleta, nombre })
  }
  return entries
}

/** Gestiona la lista oficial de alumnos del grupo (carga masiva por texto). */
export function RosterPanel({
  roster,
  isSaving,
  onSave,
  onReview,
  isReviewing,
}: RosterPanelProps) {
  const initialText = useMemo(
    () => roster.map((r) => `${r.boleta}, ${r.nombre}`).join('\n'),
    [roster],
  )
  const [text, setText] = useState(initialText)

  const parsed = parseRoster(text)

  const handleSave = async () => {
    if (parsed.length === 0) return
    await onSave({ students: parsed })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card variant="outlined">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-300" />
          <h3 className="text-h3 text-text-primary">Lista oficial de alumnos</h3>
          <Tooltip label="Una línea por alumno: boleta, nombre completo. Separa con coma, punto y coma o tabulador.">
            <span className="cursor-help rounded-full bg-white/10 px-2 text-caption text-text-secondary">
              ?
            </span>
          </Tooltip>
        </div>
        <Textarea
          rows={10}
          placeholder={'2021630001, Ana López Pérez\n2021630002, Luis García Ruiz'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-body-sm"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-caption text-text-secondary">
            {parsed.length} alumno(s) detectado(s)
          </span>
          <Button onClick={handleSave} isLoading={isSaving} disabled={parsed.length === 0}>
            <Save className="h-4 w-4" />
            Guardar lista
          </Button>
        </div>
      </Card>

      <Card variant="outlined">
        <h3 className="mb-3 text-h3 text-text-primary">
          Alumnos registrados ({roster.length})
        </h3>
        {roster.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-text-secondary">
            Aún no hay alumnos en la lista.
          </p>
        ) : (
          <ul className="max-h-96 space-y-1.5 overflow-y-auto">
            {roster.map((r) => (
              <li
                key={r.boleta}
                className="rounded-lg bg-white/5 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-body-sm font-medium text-text-primary">
                      {r.nombre}
                    </span>
                    <span className="block font-mono text-caption text-text-secondary">
                      {r.boleta}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {r.claim_status && (
                      <Tooltip label={CLAIM_BADGE[r.claim_status].help}>
                        <span
                          className={`rounded-full px-2 py-0.5 text-caption font-semibold ${CLAIM_BADGE[r.claim_status].className}`}
                        >
                          {CLAIM_BADGE[r.claim_status].label}
                        </span>
                      </Tooltip>
                    )}
                    {r.profe_score !== null && (
                      <Tooltip label="Calificación de profe">
                        <span className="rounded-full bg-primary-600/20 px-2 py-0.5 text-caption font-semibold text-primary-200">
                          {r.profe_score.toFixed(1)}
                        </span>
                      </Tooltip>
                    )}
                  </span>
                </div>
                {r.claim_email && (
                  <p className="mt-1 truncate text-caption text-text-secondary">
                    Usa la cuenta: <span className="text-text-primary">{r.claim_email}</span>
                  </p>
                )}
                {onReview && r.claim_status && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.claim_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          isLoading={isReviewing}
                          onClick={() => onReview({ boleta: r.boleta, action: 'approve' })}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          isLoading={isReviewing}
                          onClick={() => onReview({ boleta: r.boleta, action: 'reject' })}
                        >
                          <X className="h-3.5 w-3.5" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    {r.claim_status === 'approved' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        isLoading={isReviewing}
                        onClick={() => onReview({ boleta: r.boleta, action: 'reset' })}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Revocar
                      </Button>
                    )}
                    {r.claim_status === 'rejected' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        isLoading={isReviewing}
                        onClick={() => onReview({ boleta: r.boleta, action: 'reset' })}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reactivar
                      </Button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
