import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'
import { deductLife } from '../lives/lives.service'
import { updateWordProgress } from '../words/words.service'

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;:'"]/g, '')
}

export async function checkAnswer(userId: string, exerciseId: string, answer: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { wordLinks: { include: { word: true } } },
  })
  if (!exercise) throw new AppError(404, 'Mashq topilmadi')

  const isCorrect = normalize(exercise.correctAnswer) === normalize(answer)

  let livesAfter: number | null = null
  if (!isCorrect) {
    try {
      const lives = await deductLife(userId)
      livesAfter = lives.current
    } catch {
      livesAfter = 0
    }
  }

  for (const { word } of exercise.wordLinks) {
    await updateWordProgress(userId, word.id, isCorrect)
  }

  return {
    isCorrect,
    correctAnswer: isCorrect ? null : exercise.correctAnswer,
    explanation: isCorrect ? null : exercise.explanation,
    livesAfter,
  }
}
