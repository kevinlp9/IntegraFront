import { create } from 'zustand'
import type { Exposition, Room, RubricCriteria } from '@/types'

interface RoomState {
  currentRoom: Room | null
  rooms: Room[]
  criteria: RubricCriteria[]
  expositions: Exposition[]

  setCurrentRoom: (room: Room | null) => void
  setRooms: (rooms: Room[]) => void
  addRoom: (room: Room) => void
  updateRoom: (id: string, room: Partial<Room>) => void
  deleteRoom: (id: string) => void
  setCriteria: (criteria: RubricCriteria[]) => void
  addCriteria: (criteria: RubricCriteria) => void
  removeCriteria: (id: string) => void
  setExpositions: (expositions: Exposition[]) => void
  addExposition: (exposition: Exposition) => void
  updateExposition: (id: string, exposition: Partial<Exposition>) => void
  removeExposition: (id: string) => void
}

/** Global state for rooms, rubric criteria and expositions (teacher side). */
export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  rooms: [],
  criteria: [],
  expositions: [],

  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  updateRoom: (id, room) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...room } : r)),
      currentRoom:
        state.currentRoom?.id === id
          ? { ...state.currentRoom, ...room }
          : state.currentRoom,
    })),
  deleteRoom: (id) =>
    set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) })),

  setCriteria: (criteria) => set({ criteria }),
  addCriteria: (criteria) =>
    set((state) => ({ criteria: [...state.criteria, criteria] })),
  removeCriteria: (id) =>
    set((state) => ({ criteria: state.criteria.filter((c) => c.id !== id) })),

  setExpositions: (expositions) => set({ expositions }),
  addExposition: (exposition) =>
    set((state) => ({ expositions: [...state.expositions, exposition] })),
  updateExposition: (id, exposition) =>
    set((state) => ({
      expositions: state.expositions.map((e) =>
        e.id === id ? { ...e, ...exposition } : e,
      ),
    })),
  removeExposition: (id) =>
    set((state) => ({
      expositions: state.expositions.filter((e) => e.id !== id),
    })),
}))
