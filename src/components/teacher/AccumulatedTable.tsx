import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Tooltip } from '@/components/common/Tooltip'
import type { AccumulatedReport, ProfeGradeUpdate } from '@/types'

export interface AccumulatedTableProps {
  report: AccumulatedReport
  onProfeGrade: (payload: ProfeGradeUpdate) => Promise<unknown>
}

function fmt(value: number | null): string {
  return value === null || value === undefined ? '—' : value.toFixed(1)
}

/** Celda editable de la calificación de profe (se guarda al perder el foco). */
function ProfeCell({
  boleta,
  value,
  onSave,
}: {
  boleta: string
  value: number | null
  onSave: (payload: ProfeGradeUpdate) => Promise<unknown>
}) {
  const [draft, setDraft] = useState(value === null ? '' : String(value))
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setDraft(value === null ? '' : String(value))
  }

  const commit = () => {
    const trimmed = draft.trim()
    const next = trimmed === '' ? null : Number(trimmed)
    if (next !== null && !Number.isFinite(next)) return
    if (next === value) return
    void onSave({ boleta, profe_score: next })
  }

  return (
    <input
      type="number"
      min={0}
      step={0.1}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
      className="input w-20 px-2 py-1 text-center text-body-sm"
      aria-label={`Calificación de profe para ${boleta}`}
    />
  )
}

const COLUMNS: { label: string; help: string }[] = [
  { label: 'P1', help: 'Promedio del Parcial 1 (eventos individuales del alumno).' },
  { label: 'P2', help: 'Promedio del Parcial 2.' },
  { label: 'P3', help: 'Promedio del Parcial 3.' },
  { label: 'Ext', help: 'Promedio del Extraordinario.' },
  { label: 'Profe', help: 'Calificación asignada directamente por el profe (editable).' },
  { label: 'Final', help: 'Promedio final según la fórmula configurada del grupo.' },
]

/** Acumulado del semestre: una fila por alumno con parciales, profe y final. */
export function AccumulatedTable({ report, onProfeGrade }: AccumulatedTableProps) {
  return (
    <Card variant="outlined" className="overflow-x-auto">
      <h3 className="mb-4 text-h3 text-text-primary">Acumulado del semestre</h3>
      <table className="w-full min-w-[640px] border-collapse text-body-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-text-secondary">
            <th className="px-2 py-2">Alumno</th>
            {COLUMNS.map((c) => (
              <th key={c.label} className="px-2 py-2 text-center">
                <Tooltip label={c.help} position="bottom">
                  <span className="cursor-help">{c.label}</span>
                </Tooltip>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {report.rows.map((row) => (
            <tr key={row.boleta} className="border-b border-white/5">
              <td className="px-2 py-2">
                <span className="block font-medium text-text-primary">{row.nombre}</span>
                <span className="block font-mono text-caption text-text-secondary">
                  {row.boleta}
                </span>
              </td>
              <td className="px-2 py-2 text-center text-text-primary">{fmt(row.parcial_1)}</td>
              <td className="px-2 py-2 text-center text-text-primary">{fmt(row.parcial_2)}</td>
              <td className="px-2 py-2 text-center text-text-primary">{fmt(row.parcial_3)}</td>
              <td className="px-2 py-2 text-center text-text-primary">{fmt(row.extraordinario)}</td>
              <td className="px-2 py-2 text-center">
                <ProfeCell boleta={row.boleta} value={row.profe_score} onSave={onProfeGrade} />
              </td>
              <td className="px-2 py-2 text-center">
                <span className="font-semibold text-primary-200">{fmt(row.final_average)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {report.rows.length === 0 && (
        <p className="py-6 text-center text-body-sm text-text-secondary">
          Agrega alumnos a la lista oficial para ver el acumulado.
        </p>
      )}
    </Card>
  )
}
