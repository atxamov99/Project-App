import { prisma } from '../../../config/db'
import { weekStart } from '../../../utils/week'

function startOfDayUTC(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

function daysAgo(n: number): Date {
  const d = startOfDayUTC()
  d.setUTCDate(d.getUTCDate() - n)
  return d
}

export async function getDashboard() {
  const today = startOfDayUTC()
  const weekStartDate = weekStart()
  const monthAgo = daysAgo(30)

  const [
    totalUsers, newToday, newThisWeek, premiumUsers,
    totalCourses, totalLessons, totalExercises, totalWords,
    dauResults, wauResults, mauResults,
    lessonsToday,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: weekStartDate } } }),
    prisma.user.count({ where: { isPremium: true } }),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.exercise.count(),
    prisma.word.count(),
    prisma.lessonResult.findMany({
      where: { completedAt: { gte: today } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.lessonResult.findMany({
      where: { completedAt: { gte: weekStartDate } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.lessonResult.findMany({
      where: { completedAt: { gte: monthAgo } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.lessonResult.count({ where: { completedAt: { gte: today } } }),
  ])

  const avgTimeAgg = await prisma.lessonResult.aggregate({
    where: { completedAt: { gte: monthAgo } },
    _avg: { timeTaken: true },
  })

  const totalLessonStarts = await prisma.courseProgress.count({
    where: { lastStudiedAt: { gte: monthAgo } },
  })

  const totalLessonCompletes = await prisma.lessonResult.count({
    where: { completedAt: { gte: monthAgo } },
  })

  const completionRate = totalLessonStarts > 0
    ? Math.min(1, totalLessonCompletes / totalLessonStarts)
    : 0

  return {
    users: {
      total: totalUsers,
      newToday,
      newThisWeek,
      dau: dauResults.length,
      wau: wauResults.length,
      mau: mauResults.length,
      premium: premiumUsers,
    },
    content: {
      totalCourses,
      totalLessons,
      totalExercises,
      totalWords,
    },
    engagement: {
      lessonsCompletedToday: lessonsToday,
      averageSessionMinutes: Math.round(((avgTimeAgg._avg.timeTaken ?? 0) / 60) * 10) / 10,
      completionRate: Math.round(completionRate * 100) / 100,
    },
  }
}

export async function getTroubledExercises(limit = 20) {
  // Eng ko'p o'rtacha xato bo'lgan darslar (proxy uchun mashq darajasi).
  // Mashq darajasidagi yozuv yo'q (ExerciseAttempt jadvali kelajakda qo'shiladi).
  const grouped = await prisma.lessonResult.groupBy({
    by: ['lessonId'],
    _avg: { mistakes: true },
    _count: true,
    orderBy: { _avg: { mistakes: 'desc' } },
    take: limit,
  })

  const lessonIds = grouped.map((g) => g.lessonId)
  const lessons = await prisma.lesson.findMany({
    where: { id: { in: lessonIds } },
    include: { unit: { include: { course: true } } },
  })
  const lessonMap = new Map(lessons.map((l) => [l.id, l]))

  return grouped.map((g) => ({
    lessonId: g.lessonId,
    avgMistakes: Math.round((g._avg?.mistakes ?? 0) * 100) / 100,
    attempts: typeof g._count === 'number' ? g._count : 0,
    lesson: lessonMap.get(g.lessonId) ?? null,
  }))
}
