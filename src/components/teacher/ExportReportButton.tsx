import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/common/Button'
import type { RoomReport } from '@/types'

export interface ExportReportButtonProps {
  report: RoomReport
}

/** Exports the consolidated room report as a CSV file (Excel-compatible). */
export function ExportReportButton({ report }: ExportReportButtonProps) {
  const handleExport = () => {
    const rows = [
      ['Equipo', 'Tema', 'Criterio', 'Puntaje', 'Máximo'],
      ...report.expositions.flatMap((exp) =>
        exp.criteriaBreakdown.map((c) => [
          exp.teamName,
          exp.topic ?? '',
          c.criteriaName,
          c.score.toFixed(2),
          c.maxScore.toFixed(2),
        ]),
      ),
    ]
    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte-${report.joinCode}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="secondary" onClick={handleExport}>
      <ArrowDownTrayIcon className="h-4 w-4" />
      Descargar Excel
    </Button>
  )
}
