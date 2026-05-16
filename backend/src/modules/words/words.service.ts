import { prisma } from '../../config/db'
import { nextReviewAt, nextStrength } from '../../utils/spacedRepetition'

export async function updateWordProgress(userId: string, wordId: string, correct: boolean) {
  const existing = await prisma.wordProgress.findUnique({
    where: { userId_wordId: { userId, wordId } },
  })

  const currentStrength = existing?.strength ?? 0
  const strength = nextStrength(currentStrength, correct)
  const nextAt = nextReviewAt(strength)

  return prisma.wordProgress.upsert({
    where: { userId_wordId: { userId, wordId } },
    update: {
      strength,
      nextReviewAt: nextAt,
      lastCorrect: correct,
      reviewCount: { increment: 1 },
    },
    create: {
      userId,
      wordId,
      strength,
      nextReviewAt: nextAt,
      lastCorrect: correct,
      reviewCount: 1,
    },
  })
}

export async function dueForReview(userId: string, limit = 20) {
  return prisma.wordProgress.findMany({
    where: { userId, nextReviewAt: { lte: new Date() } },
    orderBy: [{ nextReviewAt: 'asc' }, { strength: 'asc' }],
    take: limit,
    include: { word: true },
  })
}

export async function reviewedWord(userId: string, wordId: string, correct: boolean) {
  return updateWordProgress(userId, wordId, correct)
}
