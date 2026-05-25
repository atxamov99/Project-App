import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useLessonStore } from '@/store/lessonStore'
import { shuffle } from '@/utils/shuffle'
import type { Exercise, AnswerResult, CheckAnswerResponse, CompleteLessonResponse } from '@/types'

type Phase = 'loading' | 'exercise' | 'feedback' | 'complete' | 'no_lives'

export function useLesson(lessonId: string) {
  const qc = useQueryClient()
  const [phase, setPhase] = useState<Phase>('loading')
  const [result, setResult] = useState<AnswerResult>(null)
  const [correctAnswer, setCorrectAnswer] = useState<string | undefined>()
  const [explanation, setExplanation] = useState<string | undefined>()
  const [completionData, setCompletionData] = useState<CompleteLessonResponse | null>(null)
  const [lives, setLives] = useState(5)

  const exercises = useLessonStore((s) => s.exercises)
  const currentIndex = useLessonStore((s) => s.currentIndex)
  const answer = useLessonStore((s) => s.answer)
  const startedAt = useLessonStore((s) => s.startedAt)
  const setExercises = useLessonStore((s) => s.setExercises)
  const nextExercise = useLessonStore((s) => s.nextExercise)
  const addMistake = useLessonStore((s) => s.addMistake)
  const reset = useLessonStore((s) => s.reset)

  useEffect(() => {
    let mounted = true
    reset()

    ;(async () => {
      try {
        const [lessonRes, livesRes] = await Promise.all([
          api.get(`/lessons/${lessonId}`),
          api.get('/lives'),
        ])
        if (!mounted) return

        const rawExercises: Exercise[] = lessonRes.data.exercises.map((ex: Exercise) => ({
          ...ex,
          wordBank: ex.type === 'BUILD_SENTENCE'
            ? shuffle([...ex.correctAnswer.split(' '), ...ex.wrongAnswers])
            : undefined,
        }))

        setLives(livesRes.data?.current ?? 5)
        setExercises(rawExercises)
        setPhase('exercise')
      } catch {
        if (mounted) setPhase('exercise')
      }
    })()

    return () => { mounted = false }
  }, [lessonId, reset, setExercises])

  const currentExercise: Exercise | undefined = exercises[currentIndex]
  const progress = exercises.length > 0 ? currentIndex / exercises.length : 0

  const checkAnswer = useCallback(async () => {
    if (!currentExercise) return
    try {
      const { data } = await api.post<CheckAnswerResponse>(
        `/exercises/${currentExercise.id}/check`,
        { answer }
      )
      setResult(data.isCorrect ? 'correct' : 'wrong')
      setCorrectAnswer(data.correctAnswer)
      setExplanation(data.explanation)

      if (!data.isCorrect) {
        addMistake()
        const nextLives = Math.max(0, lives - 1)
        setLives(nextLives)
        qc.invalidateQueries({ queryKey: ['lives'] })
        if (nextLives === 0) {
          setPhase('no_lives')
          return
        }
      }
      setPhase('feedback')
    } catch {
      setPhase('feedback')
    }
  }, [currentExercise, answer, lives, addMistake, qc])

  const next = useCallback(async () => {
    const isLast = currentIndex + 1 >= exercises.length

    if (isLast) {
      try {
        const timeTaken = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0
        const { data } = await api.post<CompleteLessonResponse>(
          `/lessons/${lessonId}/complete`,
          { mistakes: useLessonStore.getState().mistakes, timeTaken }
        )
        setCompletionData(data)
        qc.invalidateQueries({ queryKey: ['course'] })
        qc.invalidateQueries({ queryKey: ['streak'] })
        qc.invalidateQueries({ queryKey: ['profile'] })
        qc.invalidateQueries({ queryKey: ['gems'] })
      } catch {
        setCompletionData({ xpEarned: 10, streak: 0 })
      }
      setPhase('complete')
      return
    }

    nextExercise()
    setResult(null)
    setCorrectAnswer(undefined)
    setExplanation(undefined)
    setPhase('exercise')
  }, [currentIndex, exercises.length, lessonId, startedAt, nextExercise, qc])

  return {
    phase,
    currentExercise,
    progress,
    lives,
    result,
    correctAnswer,
    explanation,
    completionData,
    checkAnswer,
    next,
  }
}
