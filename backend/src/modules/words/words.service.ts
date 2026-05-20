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

// Flashcard sessiya: avval review kerak bo'lganlar, keyin yangi so'zlar
export async function getFlashcardSession(userId: string, limit = 10, languageId?: string) {
  const safeLimit = Math.min(Math.max(1, limit), 30)

  const due = await prisma.wordProgress.findMany({
    where: {
      userId,
      nextReviewAt: { lte: new Date() },
      ...(languageId ? { word: { languageId } } : {}),
    },
    orderBy: [{ nextReviewAt: 'asc' }, { strength: 'asc' }],
    take: safeLimit,
    include: { word: { include: { language: true } } },
  })

  const dueWords = due.map((d) => ({
    id: d.word.id,
    text: d.word.text,
    translation: d.word.translation,
    category: d.word.category,
    level: d.word.level,
    language: d.word.language,
    strength: d.strength,
    isNew: false,
  }))

  if (dueWords.length < safeLimit) {
    const need = safeLimit - dueWords.length
    const seenIds = await prisma.wordProgress.findMany({
      where: { userId },
      select: { wordId: true },
    })
    const seenSet = new Set(seenIds.map((s) => s.wordId))

    const newWords = await prisma.word.findMany({
      where: {
        id: { notIn: Array.from(seenSet) },
        ...(languageId ? { languageId } : {}),
      },
      include: { language: true },
      take: need,
      orderBy: { text: 'asc' },
    })

    for (const w of newWords) {
      dueWords.push({
        id: w.id,
        text: w.text,
        translation: w.translation,
        category: w.category,
        level: w.level,
        language: w.language,
        strength: 0,
        isNew: true,
      })
    }
  }

  const [totalLearned, totalDue] = await Promise.all([
    prisma.wordProgress.count({ where: { userId, strength: { gte: 3 } } }),
    prisma.wordProgress.count({ where: { userId, nextReviewAt: { lte: new Date() } } }),
  ])

  return {
    cards: dueWords,
    stats: { totalLearned, totalDue },
  }
}

export async function browseWords(opts: {
  languageId?: string
  category?: string
  level?: string
  search?: string
  page?: number
  limit?: number
}) {
  const page = Math.max(1, opts.page ?? 1)
  const limit = Math.min(50, Math.max(1, opts.limit ?? 30))
  const where: any = {}
  if (opts.languageId) where.languageId = opts.languageId
  if (opts.category) where.category = opts.category
  if (opts.level) where.level = opts.level
  if (opts.search) {
    where.OR = [
      { text: { contains: opts.search, mode: 'insensitive' } },
      { translation: { contains: opts.search, mode: 'insensitive' } },
    ]
  }

  const [items, total, categories] = await Promise.all([
    prisma.word.findMany({
      where,
      include: { language: true },
      orderBy: [{ level: 'asc' }, { text: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.word.count({ where }),
    prisma.word.findMany({
      where: opts.languageId ? { languageId: opts.languageId } : {},
      distinct: ['category'],
      select: { category: true },
    }),
  ])

  return {
    items,
    total,
    page,
    limit,
    categories: categories.map((c) => c.category).filter(Boolean),
  }
}
