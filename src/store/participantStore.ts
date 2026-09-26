import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ParticipantState {
  joinCode: string | null
  evaluatorName: string | null
  /** Id of the last exposition this participant already answered, to avoid duplicates. */
  lastAnsweredExpositionId: number | null

  setParticipant: (joinCode: string, evaluatorName: string) => void
  markAnswered: (expositionId: number) => void
  reset: () => void
}

/** Persists the participant's session (no login, so we keep it in localStorage). */
export const useParticipantStore = create<ParticipantState>()(
  persist(
    (set) => ({
      joinCode: null,
      evaluatorName: null,
      lastAnsweredExpositionId: null,

      setParticipant: (joinCode, evaluatorName) =>
        set({ joinCode, evaluatorName }),
      markAnswered: (expositionId) =>
        set({ lastAnsweredExpositionId: expositionId }),
      reset: () =>
        set({
          joinCode: null,
          evaluatorName: null,
          lastAnsweredExpositionId: null,
        }),
    }),
    { name: 'integra-participant' },
  ),
)
