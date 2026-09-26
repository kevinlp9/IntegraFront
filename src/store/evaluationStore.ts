import { create } from 'zustand'
import type { Exposition } from '@/types'
import type { EvaluationDraft } from '@/types/evaluation'

interface EvaluationState {
  currentExposition: Exposition | null
  currentEvaluations: EvaluationDraft[]

  setCurrentExposition: (exposition: Exposition | null) => void
  setCurrentEvaluations: (evaluations: EvaluationDraft[]) => void
  addEvaluation: (evaluation: EvaluationDraft) => void
  updateEvaluation: (criteriaId: string, score: number) => void
  resetEvaluations: () => void
}

/** Global state for the student's in-progress evaluation draft. */
export const useEvaluationStore = create<EvaluationState>((set) => ({
  currentExposition: null,
  currentEvaluations: [],

  setCurrentExposition: (exposition) => set({ currentExposition: exposition }),
  setCurrentEvaluations: (evaluations) =>
    set({ currentEvaluations: evaluations }),
  addEvaluation: (evaluation) =>
    set((state) => ({
      currentEvaluations: [...state.currentEvaluations, evaluation],
    })),
  updateEvaluation: (criteriaId, score) =>
    set((state) => ({
      currentEvaluations: state.currentEvaluations.map((ev) =>
        ev.criteriaId === criteriaId ? { ...ev, score } : ev,
      ),
    })),
  resetEvaluations: () =>
    set({ currentExposition: null, currentEvaluations: [] }),
}))
