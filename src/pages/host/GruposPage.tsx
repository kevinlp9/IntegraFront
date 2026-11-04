import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Tooltip } from '@/components/common/Tooltip'
import { FormulaEditor } from '@/components/teacher/FormulaEditor'
import { useGrupos } from '@/hooks/useGrupo'
import type { GradeFormula } from '@/types'

const DEFAULT_FORMULA: GradeFormula = {
  parcial_1: 1,
  parcial_2: 1,
  parcial_3: 1,
  extraordinario: 0,
  profe: 1,
}

/** Hub de Grupos/Clases del semestre: lista y creación. */
export default function GruposPage() {
  const { grupos, isLoading, createGrupo, isCreating } = useGrupos()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [semester, setSemester] = useState('')
  const [formula, setFormula] = useState<GradeFormula>(DEFAULT_FORMULA)

  const reset = () => {
    setName('')
    setSemester('')
    setFormula(DEFAULT_FORMULA)
  }

  const handleCreate = async () => {
    if (!name.trim()) return
    await createGrupo({
      name: name.trim(),
      semester: semester.trim() || undefined,
      formula,
    })
    reset()
    setIsOpen(false)
  }

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 text-gradient">Mis Grupos</h1>
          <p className="text-body-sm text-text-secondary">
            Clases del semestre con historial, lista de alumnos y acumulado.
          </p>
        </div>
        <Tooltip label="Crea un grupo del semestre que agrupa todos sus eventos (parciales).">
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo Grupo
          </Button>
        </Tooltip>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grupos.map((grupo) => (
            <Card key={grupo.id} hoverable className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-h3 text-text-primary">{grupo.name}</h3>
                <Users className="h-5 w-5 shrink-0 text-primary-300" />
              </div>
              <p className="text-body-sm text-text-secondary">
                {grupo.semester ? `Semestre ${grupo.semester}` : 'Sin semestre'}
              </p>
              <Tooltip label="Código para que los alumnos localicen el grupo.">
                <p className="font-mono text-body-sm font-semibold text-primary-300">
                  {grupo.join_code}
                </p>
              </Tooltip>
              <Link to={`/grupos/${grupo.id}`}>
                <Button fullWidth variant="secondary">
                  Abrir
                </Button>
              </Link>
            </Card>
          ))}
        </motion.div>
      )}

      {!isLoading && grupos.length === 0 && (
        <p className="py-16 text-center text-body text-text-secondary">
          Aún no tienes grupos. ¡Crea el primero del semestre! 🎓
        </p>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Crear Grupo del semestre"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del grupo"
            placeholder="Ej: Cálculo Multivariable - 3BV2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Semestre (opcional)"
            placeholder="Ej: 2025-1"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
          <FormulaEditor value={formula} onChange={setFormula} />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              fullWidth
              isLoading={isCreating}
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              Crear
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}
