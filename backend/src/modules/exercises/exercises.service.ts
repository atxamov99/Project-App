import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'
import { deductLife } from '../lives/lives.service'
import { updateWordProgress } from '../words/words.service'

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:'"`]/g, '')
    .replace(/\bit['']?s\b/g, "it is")
    .replace(/\bdon['']?t\b/g, "do not")
    .replace(/\bcan['']?t\b/g, "cannot")
    .replace(/\bi['']?m\b/g, "i am")
    .replace(/\byou['']?re\b/g, "you are")
    .replace(/\bwon['']?t\b/g, "will not")
}

function expandAlternatives(answer: string): string[] {
  // Asl javob `|` bilan ajratilgan bo'lsa, har birini variant sifatida olamiz
  const parts = answer.split('|').map((s) => s.trim()).filter(Boolean)
  const variants = new Set<string>()
  for (const part of parts) {
    variants.add(normalize(part))
    // "Nice to meet you" → "It is nice to meet you" ham qabul qilinsin
    const n = normalize(part)
    if (!n.startsWith('it is ') && !n.startsWith('it ')) {
      variants.add(`it is ${n}`)
    }
  }
  return Array.from(variants)
}

export async function checkAnswer(userId: string, exerciseId: string, answer: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { wordLinks: { include: { word: true } } },
  })
  if (!exercise) throw new AppError(404, 'Mashq topilmadi')

  const userNormalized = normalize(answer)
  const acceptable = expandAlternatives(exercise.correctAnswer)
  const isCorrect = acceptable.includes(userNormalized)

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

  // Foydalanuvchiga ko'rsatish uchun — `|` bilan ajratilgan bo'lsa, birinchi variantni olamiz
  const displayAnswer = exercise.correctAnswer.split('|')[0].trim()

  return {
    isCorrect,
    correctAnswer: isCorrect ? null : displayAnswer,
    explanation: isCorrect ? null : exercise.explanation,
    livesAfter,
  }
}
