import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 20

export async function getPracticeSession(userId: string, limit = DEFAULT_LIMIT) {
  const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT)

  // Foydalanuvchi yakunlagan darslar
  const results = await prisma.lessonResult.findMany({
    where: { userId },
    select: { lessonId: true },
    distinct: ['lessonId'],
  })
  const completedLessonIds = results.map((r) => r.lessonId)

  if (completedLessonIds.length === 0) {
    throw new AppError(400, 'Mashq qilish uchun avval bir nechta darsni yakunlang')
  }

  // Shu darslardagi barcha mashqlar
  const links = await prisma.lessonExercise.findMany({
    where: { lessonId: { in: completedLessonIds } },
    include: {
      exercise: {
        select: {
          id: true,
          type: true,
          question: true,
          questionAudio: true,
          questionImage: true,
          wrongAnswers: true,
          targetLangCode: true,
          difficulty: true,
        },
      },
    },
  })

  if (links.length === 0) {
    throw new AppError(400, "Mashq topilmadi. Avval darslarni yakunlang")
  }

  // Noyob mashqlar (bir mashq bir nechta darsda bo'lishi mumkin)
  const uniqueMap = new Map<string, typeof links[number]['exercise']>()
  for (const link of links) {
    uniqueMap.set(link.exercise.id, link.exercise)
  }
  const unique = Array.from(uniqueMap.values())

  // Tasodifiy aralashtirish va N tasini olish
  const shuffled = unique.sort(() => Math.random() - 0.5).slice(0, safeLimit)

  return {
    exercises: shuffled,
    total: shuffled.length,
  }
}
