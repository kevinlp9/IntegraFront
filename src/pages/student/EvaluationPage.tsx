import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { JoinRoomForm } from '@/components/student/JoinRoomForm'
import { EvaluationForm } from '@/components/student/EvaluationForm'
import { useEvaluations } from '@/hooks/useEvaluations'
import { roomService } from '@/services/room.service'
import { useNotification } from '@/hooks/useNotification'
import type { Exposition, Room, RubricCriteria } from '@/types'

/**
 * Student-facing page: join a room by code, then evaluate the currently
 * active exposition. Handles the full join → evaluate → submit flow.
 */
export default function EvaluationPage() {
  const {
    joinRoom,
    submitEvaluation,
    setCurrentExposition,
    setCurrentEvaluations,
    isSubmitting,
  } = useEvaluations()
  const notify = useNotification()

  const [room, setRoom] = useState<Room | null>(null)
  const [studentName, setStudentName] = useState('')
  const [criteria, setCriteria] = useState<RubricCriteria[]>([])
  const [activeExposition, setActiveExposition] = useState<Exposition | null>(
    null,
  )
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleJoin = async (joinCode: string, name: string) => {
    const joinedRoom = await joinRoom(joinCode)
    const [rubrics, expositions] = await Promise.all([
      roomService.listRubrics(joinedRoom.id),
      roomService.listExpositions(joinedRoom.id),
    ])
    const active = expositions.find((e) => e.status === 'active') ?? null

    setRoom(joinedRoom)
    setStudentName(name)
    setCriteria(rubrics)
    setActiveExposition(active)
    setCurrentExposition(active)
    setCurrentEvaluations(
      rubrics.map((c) => ({
        criteriaId: c.id,
        criteriaName: c.name,
        maxScore: c.maxScore,
        score: 0,
      })),
    )
    notify.success('¡Te uniste a la sala!')
  }

  const handleSubmit = async (
    scores: Record<string, number>,
    comment: string,
  ) => {
    setCurrentEvaluations(
      criteria.map((c) => ({
        criteriaId: c.id,
        criteriaName: c.name,
        maxScore: c.maxScore,
        score: scores[c.id] ?? 0,
      })),
    )
    await submitEvaluation(studentName, comment)
    setHasSubmitted(true)
  }

  if (!room) {
    return (
      <AuthLayout title="📚 Unirse a Sala" subtitle="Evalúa exposiciones en vivo">
        <JoinRoomForm onJoin={handleJoin} />
      </AuthLayout>
    )
  }

  if (hasSubmitted) {
    return (
      <AuthLayout title="¡Gracias!" subtitle={room.name}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-6 text-center text-body text-gray-600 dark:text-gray-300"
        >
          ✅ Tu evaluación fue enviada correctamente. Espera al próximo
          equipo.
        </motion.p>
      </AuthLayout>
    )
  }

  if (!activeExposition) {
    return (
      <AuthLayout title={room.name} subtitle="Sala de evaluación">
        <p className="py-6 text-center text-body text-gray-500">
          Aún no hay un equipo activo. Espera a que el profesor active una
          exposición.
        </p>
      </AuthLayout>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-primary-900">
      <div className="mx-auto max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExposition.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EvaluationForm
              exposition={activeExposition}
              criteria={criteria}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
