import { Download } from 'lucide-react'
import { Button } from '@/components/common/Button'
import type { RoomReport } from '@/types'

export interface ExportReportButtonProps {
  report: RoomReport
}

/** Exports the room's ranking report as a CSV file (Excel-compatible). */
export function ExportReportButton({ report }: ExportReportButtonProps) {
  const handleExport = () => {
    const rows = [
      ['Posición', 'Elemento', 'Puntaje Final', 'Criterio', 'Promedio', 'Máximo', 'Votos'],
      ...report.expositions.flatMap((exp) =>
        exp.criteria_breakdown.length > 0
          ? exp.criteria_breakdown.map((c) => [
              exp.position ?? '',
              exp.name,
              exp.final_score?.toFixed(2) ?? '',
              c.name,
              c.average_score.toFixed(2),
              c.max_score.toFixed(2),
              c.total_votes,
            ])
          : [[exp.position ?? '', exp.name, exp.final_score?.toFixed(2) ?? '', '', '', '', '']],
      ),
    ]
    const csv = rows
      .map((r) => r.map((cell) => `"${cell}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ranking-sala-${report.room_id}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="secondary" onClick={handleExport}>
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
