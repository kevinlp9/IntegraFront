import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { RoomStatusBadge } from '@/components/common/RoomStatusBadge'
import { useRooms } from '@/hooks/useRoom'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

/** Host dashboard: lists rooms and allows creating new ones. */
export default function DashboardPage() {
  const { rooms, isLoading, createRoom, isCreating } = useRooms()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return
    await createRoom({ name: name.trim() })
    setName('')
    setIsModalOpen(false)
  }

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 text-text-primary">
            Mis Salas
          </h1>
          <p className="text-body-sm text-text-secondary">
            Crea y controla tus salas de evaluación en vivo.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva Sala
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {rooms.map((room) => (
            <motion.div key={room.id} variants={itemVariants}>
              <Card hoverable className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-h3 text-text-primary">{room.name}</h3>
                  <RoomStatusBadge status={room.status} />
                </div>
                <p className="font-mono text-body-sm font-semibold text-primary-300">
                  {room.join_code}
                </p>
                <Link to={`/rooms/${room.id}`}>
                  <Button fullWidth variant="secondary">
                    Entrar
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && rooms.length === 0 && (
        <p className="py-16 text-center text-body text-text-secondary">
          Aún no tienes salas. ¡Crea la primera! 🎉
        </p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Sala Nueva"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la sala"
            placeholder="Ej: Trivia de Historia"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button fullWidth isLoading={isCreating} onClick={handleCreate}>
              Crear
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}
