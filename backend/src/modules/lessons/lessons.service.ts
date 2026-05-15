import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'
import { calculateXP } from '../../utils/xp'
import { updateStreak } from '../streak/streak.service'
import { addWeeklyXP } from '../league/league.service'
import { checkAfterLesson } from '../achievements/achievements.service'

export async function getLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: { include: { course: { include: { fromLanguage: true, toLanguage: true } } } },
      exercises: {
        orderBy: { order: 'asc' },
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
              // correctAnswer va explanation oshkor qilinmaydi (cheating'ni oldini olish)
            },
          },
        },
      },
    },
  })

  if (!lesson) throw new AppError(404, 'Dars topilmadi')

  return {
    id: lesson.id,
    order: lesson.order,
    type: lesson.type,
    xpReward: lesson.xpReward,
    unit: { id: lesson.unit.id, title: lesson.unit.title },
    course: {
      id: lesson.unit.course.id,
      from: lesson.unit.course.fromLanguage.code,
      to: lesson.unit.course.toLanguage.code,
    },
    exercises: lesson.exercises.map((le) => le.exercise),
  }
}

export interface CompleteInput {
  mistakes?: number
  timeTaken?: number
}

export async function completeLesson(userId: string, lessonId: string, input: CompleteInput) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { unit: true },
  })
  if (!lesson) throw new AppError(404, 'Dars topilmadi')

  const mistakes = input.mistakes ?? 0
  const timeTaken = input.timeTaken ?? 0
  const xpEarned = calculateXP(lesson.xpReward, mistakes)

  const result = await prisma.lessonResult.create({
    data: { userId, lessonId, xpEarned, mistakes, timeTaken },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { totalXP: { increment: xpEarned } },
  })

  // Keyingi yakunlanmagan darsni topish
  const nextLessonId = await findNextLessonId(userId, lesson.unit.courseId, lessonId)

  await prisma.courseProgress.upsert({
    where: { userId_courseId: { userId, courseId: lesson.unit.courseId } },
    update: {
      totalXP: { increment: xpEarned },
      currentLessonId: nextLessonId,
      lastStudiedAt: new Date(),
    },
    create: {
      userId,
      courseId: lesson.unit.courseId,
      totalXP: xpEarned,
      currentLessonId: nextLessonId,
      lastStudiedAt: new Date(),
    },
  })

  const streakResult = await updateStreak(userId)
  await addWeeklyXP(userId, xpEarned)
  const newAchievements = await checkAfterLesson(userId, streakResult.streak)

  return {
    xpEarned,
    streak: streakResult.streak,
    isNewStreak: streakResult.isNew,
    longestStreak: streakResult.longestStreak,
    achievements: newAchievements,
    resultId: result.id,
  }
}

async function findNextLessonId(userId: string, courseId: string, justCompletedLessonId: string): Promise<string | null> {
  const units = await prisma.unit.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: { lessons: { orderBy: { order: 'asc' }, select: { id: true } } },
  })
  const allLessonIds = units.flatMap((u) => u.lessons.map((l) => l.id))
  const completedResults = await prisma.lessonResult.findMany({
    where: { userId, lessonId: { in: allLessonIds } },
    select: { lessonId: true },
  })
  const completed = new Set(completedResults.map((r) => r.lessonId))
  completed.add(justCompletedLessonId)
  for (const lessonId of allLessonIds) {
    if (!completed.has(lessonId)) return lessonId
  }
  return null
}
