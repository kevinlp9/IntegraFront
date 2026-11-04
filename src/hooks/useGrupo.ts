import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { grupoService } from '@/services/grupo.service'
import { roomService } from '@/services/room.service'
import type {
  CreateGrupoPayload,
  CreateRoomPayload,
  ClaimReview,
  ProfeGradeUpdate,
  RosterUpload,
  UpdateGrupoPayload,
} from '@/types'

/** Lista los grupos del profe y expone una mutación para crear uno nuevo. */
export function useGrupos() {
  const queryClient = useQueryClient()

  const gruposQuery = useQuery({
    queryKey: ['grupos'],
    queryFn: () => grupoService.list(),
  })

  const createGrupo = useMutation({
    mutationFn: (payload: CreateGrupoPayload) => grupoService.create(payload),
    onSuccess: () => {
      toast.success('Grupo creado 🎉')
      void queryClient.invalidateQueries({ queryKey: ['grupos'] })
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo crear el grupo'),
  })

  return {
    grupos: gruposQuery.data ?? [],
    isLoading: gruposQuery.isLoading,
    createGrupo: createGrupo.mutateAsync,
    isCreating: createGrupo.isPending,
  }
}

/** Detalle de un grupo: info, salas, roster, acumulado y mutaciones. */
export function useGrupo(grupoId?: number) {
  const queryClient = useQueryClient()
  const enabled = !!grupoId

  const grupoQuery = useQuery({
    queryKey: ['grupo', grupoId],
    queryFn: () => grupoService.get(grupoId!),
    enabled,
  })

  const roomsQuery = useQuery({
    queryKey: ['grupo-rooms', grupoId],
    queryFn: () => grupoService.listRooms(grupoId!),
    enabled,
  })

  const rosterQuery = useQuery({
    queryKey: ['grupo-roster', grupoId],
    queryFn: () => grupoService.listRoster(grupoId!),
    enabled,
  })

  const accumulatedQuery = useQuery({
    queryKey: ['grupo-accumulated', grupoId],
    queryFn: () => grupoService.accumulated(grupoId!),
    enabled,
  })

  const invalidateGrades = () => {
    void queryClient.invalidateQueries({ queryKey: ['grupo-accumulated', grupoId] })
    void queryClient.invalidateQueries({ queryKey: ['grupo-roster', grupoId] })
  }

  const createRoom = useMutation({
    mutationFn: (payload: CreateRoomPayload) =>
      roomService.create({ ...payload, grupo_id: grupoId }),
    onSuccess: () => {
      toast.success('Evento creado 🎉')
      void queryClient.invalidateQueries({ queryKey: ['grupo-rooms', grupoId] })
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo crear el evento'),
  })

  const setRoster = useMutation({
    mutationFn: (payload: RosterUpload) =>
      grupoService.setRoster(grupoId!, payload),
    onSuccess: () => {
      toast.success('Lista de alumnos guardada')
      invalidateGrades()
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo guardar la lista'),
  })

  const setProfeGrade = useMutation({
    mutationFn: (payload: ProfeGradeUpdate) =>
      grupoService.setProfeGrade(grupoId!, payload),
    onSuccess: () => invalidateGrades(),
    onError: (e: Error) => toast.error(e.message || 'No se pudo guardar la calificación'),
  })

  const reviewClaim = useMutation({
    mutationFn: (payload: ClaimReview) =>
      grupoService.reviewClaim(grupoId!, payload),
    onSuccess: (_data, variables) => {
      const msg =
        variables.action === 'approve'
          ? 'Alumno aprobado'
          : variables.action === 'reject'
            ? 'Acceso rechazado'
            : 'Reclamo reiniciado'
      toast.success(msg)
      invalidateGrades()
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar el reclamo'),
  })

  const updateGrupo = useMutation({
    mutationFn: (payload: UpdateGrupoPayload) =>
      grupoService.update(grupoId!, payload),
    onSuccess: () => {
      toast.success('Grupo actualizado')
      void queryClient.invalidateQueries({ queryKey: ['grupo', grupoId] })
      invalidateGrades()
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar'),
  })

  return {
    grupo: grupoQuery.data ?? null,
    rooms: roomsQuery.data ?? [],
    roster: rosterQuery.data ?? [],
    accumulated: accumulatedQuery.data ?? null,
    isLoading: grupoQuery.isLoading,
    createRoom: createRoom.mutateAsync,
    isCreatingRoom: createRoom.isPending,
    setRoster: setRoster.mutateAsync,
    isSavingRoster: setRoster.isPending,
    setProfeGrade: setProfeGrade.mutateAsync,
    reviewClaim: reviewClaim.mutateAsync,
    isReviewingClaim: reviewClaim.isPending,
    updateGrupo: updateGrupo.mutateAsync,
    isUpdating: updateGrupo.isPending,
  }
}
