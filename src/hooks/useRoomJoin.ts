import { useQuery } from '@tanstack/react-query'
import { evaluationService } from '@/services/evaluation.service'

/**
 * Public polling hook for the participant's room state. Refetches every
 * 2.5s to detect status changes (waiting → active) or a new active
 * exposition, per the "Kahoot-style" polling strategy (no WebSockets yet).
 */
export function useRoomJoin(joinCode: string | null) {
  const query = useQuery({
    queryKey: ['room-join', joinCode],
    queryFn: () => evaluationService.joinByCode(joinCode!),
    enabled: !!joinCode,
    refetchInterval: 2500,
    retry: false,
  })

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
  }
}
