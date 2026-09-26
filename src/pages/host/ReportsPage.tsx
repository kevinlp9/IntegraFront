import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { PodiumView } from '@/components/report/PodiumView'
import { CriteriaBreakdown } from '@/components/report/CriteriaBreakdown'
import { ExportReportButton } from '@/components/report/ExportReportButton'
import { useRoomReport } from '@/hooks/useRoomReport'

/** Host reports page: podium for top 3 + full ranking with expandable breakdown. */
export default function ReportsPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const numericId = roomId ? Number(roomId) : undefined
  const { report, isLoading } = useRoomReport(numericId)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (isLoading || !report) {
    return (
      <MainLayout>
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      </MainLayout>
    )
  }

  const rest = report.expositions.slice(3)

  return (
    <MainLayout>
      <div className="mb-4 flex items-center justify-between">
        <Link to={`/rooms/${report.room_id}`}>
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <ExportReportButton report={report} />
      </div>

      <h1 className="mb-2 text-center font-display text-h2 text-text-primary">
        {report.room_name}
      </h1>
      <p className="mb-4 text-center text-body-sm text-text-secondary">
        Ranking Final 🏆
      </p>

      <PodiumView expositions={report.expositions} />

      {rest.length > 0 && (
        <Card variant="outlined" className="mt-6 divide-y divide-white/5">
          {rest.map((exp) => (
            <div key={exp.exposition_id} className="py-2">
              <button
                type="button"
                onClick={() =>
                  setExpandedId(
                    expandedId === exp.exposition_id ? null : exp.exposition_id,
                  )
                }
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="text-body-sm font-semibold text-text-secondary">
                    #{exp.position}
                  </span>
                  <span className="text-body font-medium text-text-primary">
                    {exp.name}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-primary-300">
                    {exp.final_score?.toFixed(1) ?? '—'}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-text-secondary transition-transform ${
                      expandedId === exp.exposition_id ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </button>
              <AnimatePresence>
                {expandedId === exp.exposition_id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pb-3"
                  >
                    <CriteriaBreakdown criteria={exp.criteria_breakdown} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Card>
      )}
    </MainLayout>
  )
}
