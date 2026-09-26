import { useQuery } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'

/** Fetches the final ranking report for a room (host-only). */
export function useRoomReport(roomId?: number) {
  const query = useQuery({
    queryKey: ['report', roomId],
    queryFn: () => roomService.report(roomId!),
    enabled: !!roomId,
  })

  return {
    report: query.data ?? null,
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}
