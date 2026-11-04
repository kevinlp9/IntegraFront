import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Tooltip } from '@/components/common/Tooltip'
import { grupoService } from '@/services/grupo.service'
import { PERIOD_LABELS } from '@/types'

/** Historial del alumno en un grupo: su calificación y retroalimentación por evento. */
export default function StudentHistoryPage() {
  const navigate = useNavigate()
  const { grupoId } = useParams<{ grupoId: string }>()
  const numericId = grupoId ? Number(grupoId) : undefined

  const { data, isLoading, isError } = useQuery({
    queryKey: ['mi-historial', numericId],
    queryFn: () => grupoService.myHistory(numericId!),
    enabled: !!numericId,
    retry: false,
  })

  return (
    <AuthLayout
      title="📈 Mi historial"
      subtitle={data?.grupo_name ?? 'Calificaciones y retroalimentación'}
    >
      <Button variant="secondary" size="sm" onClick={() => navigate('/join')}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      {isLoading && (
        <div className="mt-4 h-40 animate-pulse rounded-3xl bg-white/5" />
      )}

      {isError && (
        <p className="mt-6 text-center text-body-sm text-error">
          No puedes ver el historial de este grupo.
        </p>
      )}

      {data && (
        <div className="mt-4 space-y-3">
          {data.events.length === 0 && (
            <p className="py-8 text-center text-body-sm text-text-secondary">
              Aún no hay eventos en este grupo.
            </p>
          )}
          {data.events.map((event) => (
            <Card key={event.room_id} variant="outlined" className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-body font-semibold text-text-primary">
                    {event.room_name}
                  </h3>
                  <span className="rounded-full bg-primary-600/20 px-2 py-0.5 text-caption font-semibold text-primary-200">
                    {PERIOD_LABELS[event.period]}
                  </span>
                </div>
                <Tooltip label="Tu calificación en este evento">
                  <span className="text-h3 font-bold text-primary-200">
                    {event.score !== null ? event.score.toFixed(1) : '—'}
                  </span>
                </Tooltip>
              </div>

              {event.criteria.length > 0 && (
                <ul className="space-y-1">
                  {event.criteria.map((c) => (
                    <li
                      key={c.name}
                      className="flex items-center justify-between text-body-sm"
                    >
                      <span className="text-text-secondary">{c.name}</span>
                      <span className="text-text-primary">
                        {c.average_score !== null
                          ? `${c.average_score.toFixed(1)} / ${c.max_score}`
                          : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {event.feedback.length > 0 && (
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-caption font-semibold text-text-secondary">
                    <MessageSquare className="h-4 w-4" />
                    Retroalimentación recibida
                  </div>
                  <ul className="space-y-1.5">
                    {event.feedback.map((f, i) => (
                      <li
                        key={i}
                        className="rounded-lg bg-white/5 px-3 py-2 text-body-sm text-text-primary"
                      >
                        “{f}”
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </AuthLayout>
  )
}
