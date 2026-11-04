import type { GradeFormula } from '@/types'
import { Input } from '@/components/common/Input'
import { Tooltip } from '@/components/common/Tooltip'
import { Info } from 'lucide-react'

export interface FormulaEditorProps {
  value: GradeFormula
  onChange: (value: GradeFormula) => void
}

const FIELDS: { key: keyof GradeFormula; label: string; help: string }[] = [
  { key: 'parcial_1', label: 'Parcial 1', help: 'Peso del Parcial 1 en el promedio final.' },
  { key: 'parcial_2', label: 'Parcial 2', help: 'Peso del Parcial 2 en el promedio final.' },
  { key: 'parcial_3', label: 'Parcial 3', help: 'Peso del Parcial 3 en el promedio final.' },
  {
    key: 'extraordinario',
    label: 'Extraordinario',
    help: 'Peso del Extraordinario. Usa 0 si no aplica.',
  },
  {
    key: 'profe',
    label: 'Calificación de profe',
    help: 'Peso de la calificación que asignas directamente a cada alumno.',
  },
]

/**
 * Editor de la fórmula del promedio final: un peso por componente. El promedio
 * se calcula como suma ponderada ignorando componentes sin calificación.
 */
export function FormulaEditor({ value, onChange }: FormulaEditorProps) {
  const update = (key: keyof GradeFormula, raw: string) => {
    const num = Number(raw)
    onChange({ ...value, [key]: Number.isFinite(num) && num >= 0 ? num : 0 })
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-body-sm font-semibold text-text-secondary">
          Fórmula del promedio final (pesos)
        </span>
        <Tooltip label="Promedio ponderado: cada componente se multiplica por su peso. Los componentes sin calificación se ignoran. Peso 0 = no cuenta.">
          <Info className="h-4 w-4 text-text-secondary" />
        </Tooltip>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FIELDS.map((f) => (
          <Tooltip key={f.key} label={f.help} position="bottom">
            <Input
              label={f.label}
              type="number"
              min={0}
              step={0.5}
              value={String(value[f.key])}
              onChange={(e) => update(f.key, e.target.value)}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
