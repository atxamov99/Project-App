import { create } from 'zustand'
import type { AnswerResult, Exercise } from '@/types'

interface LessonState {
  exercises: Exercise[]
  currentIndex: number
  answer: string
  result: AnswerResult
  mistakes: number
  startedAt: number | null

  setExercises: (exercises: Exercise[]) => void
  setAnswer: (answer: string) => void
  setResult: (result: AnswerResult) => void
  nextExercise: () => void
  addMistake: () => void
  reset: () => void
}

export const useLessonStore = create<LessonState>((set) => ({
  exercises: [],
  currentIndex: 0,
  answer: '',
  result: null,
  mistakes: 0,
  startedAt: null,

  setExercises: (exercises) => set({ exercises, currentIndex: 0, startedAt: Date.now() }),
  setAnswer: (answer) => set({ answer }),
  setResult: (result) => set({ result }),
  nextExercise: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      answer: '',
      result: null,
    })),
  addMistake: () => set((state) => ({ mistakes: state.mistakes + 1 })),
  reset: () =>
    set({ exercises: [], currentIndex: 0, answer: '', result: null, mistakes: 0, startedAt: null }),
}))
