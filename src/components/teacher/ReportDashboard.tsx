import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/common/Card'
import { Spinner } from '@/components/common/Spinner'
import { PerformanceChart } from './PerformanceChart'
import { ExportReportButton } from './ExportReportButton'
import { formatPercentage, formatScore } from '@/utils/formatters'
import { useRoomReport } from '@/hooks/useEvaluations'

export interface ReportDashboardProps {
  roomId: string
  roomCode: string
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

/** Consolidated report view for a room: per-team score breakdown + export. */
export function ReportDashboard({ roomId, roomCode }: ReportDashboardProps) {
  const { report, isLoading, fetchReport } = useRoomReport(roomId)

  useEffect(() => {
    void fetchReport()
  }, [fetchReport])

  if (isLoading || !report) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" className="text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-h2 text-gray-900 dark:text-gray-50">
            Reporte: {report.roomName}
          </h2>
          <p className="text-body-sm text-gray-500">Código: {roomCode}</p>
        </div>
        <ExportReportButton report={report} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {report.expositions.map((exp) => (
          <motion.div key={exp.expositionId} variants={itemVariants}>
            <Card variant="elevated" className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-h3 uppercase text-gray-900 dark:text-gray-50">
                    {exp.teamName}
                  </h3>
                  {exp.topic && (
                    <p className="text-body-sm text-gray-500">{exp.topic}</p>
                  )}
                </div>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-body-sm font-semibold text-primary-700">
                  {formatScore(exp.averageScore, exp.maxPossibleScore)}
                </span>
              </div>

              <p className="text-body-sm text-gray-500">
                Evaluadores: {exp.evaluatorsCount} / {exp.totalStudents} (
                {formatPercentage(exp.evaluatorsCount, exp.totalStudents)})
              </p>

              <PerformanceChart
                teamName={exp.teamName}
                criteriaBreakdown={exp.criteriaBreakdown}
              />

              {exp.teacherFeedback && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="mb-1 text-caption font-semibold text-gray-500">
                    Feedback del Profesor
                  </p>
                  <p className="text-body-sm text-gray-700 dark:text-gray-200">
                    “{exp.teacherFeedback}”
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {report.expositions.length === 0 && (
        <p className="py-16 text-center text-body text-gray-400">
          Aún no hay evaluaciones registradas para esta sala.
        </p>
      )}
    </div>
  )
}
