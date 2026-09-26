import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { roomService } from '@/services/room.service'
import { MESSAGES } from '@/constants/messages'
import type {
  CreateExpositionPayload,
  CreateRoomPayload,
  RubricCriterionCreate,
} from '@/types'

/** Lists the host's rooms and exposes a create-room mutation. */
export function useRooms() {
  const queryClient = useQueryClient()

  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.list(),
  })

  const createRoom = useMutation({
    mutationFn: (payload: CreateRoomPayload) => roomService.create(payload),
    onSuccess: () => {
      toast.success(MESSAGES.room.createSuccess)
      void queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
    onError: () => toast.error(MESSAGES.room.createError),
  })

  return {
    rooms: roomsQuery.data ?? [],
    isLoading: roomsQuery.isLoading,
    createRoom: createRoom.mutateAsync,
    isCreating: createRoom.isPending,
  }
}

/** Host detail view: room's rubric, expositions, and live-control mutations. */
export function useRoom(roomId?: number) {
  const queryClient = useQueryClient()
  const enabled = !!roomId

  const rubricQuery = useQuery({
    queryKey: ['rubric', roomId],
    queryFn: () => roomService.listRubric(roomId!),
    enabled,
  })

  const expositionsQuery = useQuery({
    queryKey: ['expositions', roomId],
    queryFn: () => roomService.listExpositions(roomId!),
    enabled,
  })

  // The room list already contains the room; refetch it here too so the
  // detail page reflects live status changes (waiting/active/finished).
  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.list(),
    enabled,
    refetchInterval: 3000,
  })
  const room = roomsQuery.data?.find((r) => r.id === roomId) ?? null

  const invalidateAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['rooms'] })
    void queryClient.invalidateQueries({ queryKey: ['expositions', roomId] })
  }

  const createRubric = useMutation({
    mutationFn: (payload: RubricCriterionCreate) =>
      roomService.createRubric(roomId!, payload),
    onSuccess: () => {
      toast.success(MESSAGES.rubric.createSuccess)
      void queryClient.invalidateQueries({ queryKey: ['rubric', roomId] })
    },
    onError: () => toast.error(MESSAGES.rubric.createError),
  })

  const createExposition = useMutation({
    mutationFn: (payload: CreateExpositionPayload) =>
      roomService.createExposition(roomId!, payload),
    onSuccess: () => {
      toast.success(MESSAGES.exposition.createSuccess)
      void queryClient.invalidateQueries({ queryKey: ['expositions', roomId] })
    },
    onError: () => toast.error(MESSAGES.exposition.createError),
  })

  const start = useMutation({
    mutationFn: () => roomService.start(roomId!),
    onSuccess: () => {
      toast.success(MESSAGES.room.startSuccess)
      invalidateAll()
    },
    onError: () => toast.error(MESSAGES.generic.error),
  })

  const next = useMutation({
    mutationFn: () => roomService.next(roomId!),
    onSuccess: () => {
      toast.success(MESSAGES.room.nextSuccess)
      invalidateAll()
    },
    onError: () => toast.error(MESSAGES.generic.error),
  })

  const activate = useMutation({
    mutationFn: (expositionId: number) =>
      roomService.activate(roomId!, expositionId),
    onSuccess: () => {
      toast.success(MESSAGES.room.activateSuccess)
      invalidateAll()
    },
    onError: () => toast.error(MESSAGES.generic.error),
  })

  const finish = useMutation({
    mutationFn: () => roomService.finish(roomId!),
    onSuccess: () => {
      toast.success(MESSAGES.room.finishSuccess)
      invalidateAll()
    },
    onError: () => toast.error(MESSAGES.generic.error),
  })

  return {
    room,
    criteria: rubricQuery.data ?? [],
    expositions: expositionsQuery.data ?? [],
    isLoading: rubricQuery.isLoading || expositionsQuery.isLoading,
    createRubric: createRubric.mutateAsync,
    createExposition: createExposition.mutateAsync,
    start: start.mutateAsync,
    next: next.mutateAsync,
    activate: activate.mutateAsync,
    finish: finish.mutateAsync,
    isMutating:
      start.isPending || next.isPending || activate.isPending || finish.isPending,
  }
}
