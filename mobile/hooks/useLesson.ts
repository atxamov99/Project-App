import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useLessonStore } from '@/store/lessonStore'
import type { Exercise, AnswerResult, CheckAnswerResponse, CompleteLessonResponse } from '@/types'

type Phase = 'loading' | 'exercise' | 'feedback' | 'complete' | 'no_lives'

export function useLesson(lessonId: string) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [result, setResult] = useState<AnswerResult>(null)
  const [correctAnswer, setCorrectAnswer] = useState<string | undefined>()
  const [explanation, setExplanation] = useState<string | undefined>()
  const [completionData, setCompletionData] = useState<CompleteLessonResponse | null>(null)
  const [lives, setLives] = useState(5)

  const {
    exercises, currentIndex,
    answer, setExercises,
    nextExercise, addMistake, reset, startedAt,
  } = useLessonStore()

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const [lessonRes, livesRes] = await Promise.all([
          api.get(`/lessons/${lessonId}`),
          api.get('/lives'),
        ])
        if (!mounted) return

        const rawExercises: Exercise[] = lessonRes.data.exercises.map((ex: Exercise) => ({
          ...ex,
          wordBank: ex.type === 'BUILD_SENTENCE'
            ? [...ex.correctAnswer.split(' '), ...ex.wrongAnswers]
                .sort(() => Math.random() - 0.5)
            : undefined,
        }))

        setLives(livesRes.data.current)
        setExercises(rawExercises)
        setPhase('exercise')
      } catch {
        if (mounted) setPhase('exercise')
      }
    }

    reset()
    load()
    return () => { mounted = false }
  }, [lessonId])

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
        setLives((l) => Math.max(0, l - 1))
        if (lives <= 1) {
          setPhase('no_lives')
          return
        }
      }
      setPhase('feedback')
    } catch {
      setPhase('feedback')
    }
  }, [currentExercise, answer, lives])

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
  }, [currentIndex, exercises.length, lessonId, startedAt])

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
