import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { roomService } from '@/services/room.service'
import { useRoomStore } from '@/store/roomStore'
import { MESSAGES } from '@/constants/messages'
import type {
  CreateExpositionPayload,
  CreateRoomPayload,
  CreateRubricPayload,
} from '@/types'

/** Fetches and manages the teacher's room list. */
export function useRooms() {
  const { rooms, setRooms, addRoom } = useRoomStore()
  const [isLoading, setIsLoading] = useState(false)

  const fetchRooms = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await roomService.list()
      setRooms(data)
    } catch {
      toast.error(MESSAGES.generic.networkError)
    } finally {
      setIsLoading(false)
    }
  }, [setRooms])

  const createRoom = useCallback(
    async (payload: CreateRoomPayload) => {
      try {
        const room = await roomService.create(payload)
        addRoom(room)
        toast.success(MESSAGES.room.createSuccess)
        return room
      } catch {
        toast.error(MESSAGES.room.createError)
        throw new Error(MESSAGES.room.createError)
      }
    },
    [addRoom],
  )

  useEffect(() => {
    void fetchRooms()
  }, [fetchRooms])

  return { rooms, isLoading, fetchRooms, createRoom }
}

/** Fetches and manages a single room's detail, criteria and expositions. */
export function useRoom(roomId?: string) {
  const {
    currentRoom,
    setCurrentRoom,
    criteria,
    setCriteria,
    addCriteria,
    removeCriteria,
    expositions,
    setExpositions,
    addExposition,
    updateExposition,
    removeExposition,
  } = useRoomStore()
  const [isLoading, setIsLoading] = useState(false)

  const fetchRoom = useCallback(async () => {
    if (!roomId) return
    setIsLoading(true)
    try {
      const [room, rubrics, teams] = await Promise.all([
        roomService.detail(roomId),
        roomService.listRubrics(roomId),
        roomService.listExpositions(roomId),
      ])
      setCurrentRoom(room)
      setCriteria(rubrics)
      setExpositions(teams)
    } catch {
      toast.error(MESSAGES.generic.networkError)
    } finally {
      setIsLoading(false)
    }
  }, [roomId, setCurrentRoom, setCriteria, setExpositions])

  useEffect(() => {
    void fetchRoom()
  }, [fetchRoom])

  const createRubric = useCallback(
    async (payload: CreateRubricPayload) => {
      if (!roomId) return
      try {
        const rubric = await roomService.createRubric(roomId, payload)
        addCriteria(rubric)
        toast.success(MESSAGES.rubric.createSuccess)
      } catch {
        toast.error(MESSAGES.rubric.createError)
      }
    },
    [roomId, addCriteria],
  )

  const deleteRubric = useCallback(
    async (id: string) => {
      try {
        await roomService.deleteRubric(id)
        removeCriteria(id)
        toast.success(MESSAGES.rubric.deleteSuccess)
      } catch {
        toast.error(MESSAGES.generic.error)
      }
    },
    [removeCriteria],
  )

  const createExposition = useCallback(
    async (payload: CreateExpositionPayload) => {
      if (!roomId) return
      try {
        const exposition = await roomService.createExposition(
          roomId,
          payload,
        )
        addExposition(exposition)
        toast.success(MESSAGES.exposition.createSuccess)
      } catch {
        toast.error(MESSAGES.generic.error)
      }
    },
    [roomId, addExposition],
  )

  const activateTeam = useCallback(
    async (teamId: string) => {
      if (!roomId) return
      try {
        await roomService.activateTeam(roomId, teamId)
        expositions.forEach((exp) => {
          updateExposition(exp.id, {
            status: exp.id === teamId ? 'active' : exp.status,
          })
        })
        toast.success(MESSAGES.room.activateTeamSuccess)
      } catch {
        toast.error(MESSAGES.generic.error)
      }
    },
    [roomId, expositions, updateExposition],
  )

  const deleteExposition = useCallback(
    async (id: string) => {
      try {
        await roomService.deleteExposition(id)
        removeExposition(id)
        toast.success(MESSAGES.exposition.deleteSuccess)
      } catch {
        toast.error(MESSAGES.generic.error)
      }
    },
    [removeExposition],
  )

  return {
    room: currentRoom,
    criteria,
    expositions,
    isLoading,
    fetchRoom,
    createRubric,
    deleteRubric,
    createExposition,
    activateTeam,
    deleteExposition,
  }
}
