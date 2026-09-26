import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon } from '@heroicons/react/24/outline'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Spinner } from '@/components/common/Spinner'
import { CreateRoomForm } from '@/components/teacher/CreateRoomForm'
import { RoomCard } from '@/components/teacher/RoomCard'
import { useRooms } from '@/hooks/useRoom'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

/** Teacher dashboard: lists rooms and allows creating new ones. */
export default function DashboardPage() {
  const { rooms, isLoading, createRoom } = useRooms()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-gray-900 dark:text-gray-50">
            Mis Salas
          </h1>
          <p className="text-body-sm text-gray-500">
            Gestiona tus salas de evaluación de exposiciones.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Crear Sala
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-primary-600" />
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
              <RoomCard room={room} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && rooms.length === 0 && (
        <p className="py-16 text-center text-body text-gray-400">
          Aún no tienes salas. ¡Crea la primera!
        </p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Sala Nueva"
      >
        <CreateRoomForm
          onSubmit={async (payload) => {
            await createRoom(payload)
            setIsModalOpen(false)
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </MainLayout>
  )
}
