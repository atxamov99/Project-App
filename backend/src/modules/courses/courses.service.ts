import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

export async function listCourses() {
  return prisma.course.findMany({
    where: { isActive: true },
    include: {
      fromLanguage: true,
      toLanguage: true,
      _count: { select: { units: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function getCourse(courseId: string, userId?: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      fromLanguage: true,
      toLanguage: true,
      units: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              order: true,
              type: true,
              xpReward: true,
              _count: { select: { exercises: true } },
            },
          },
        },
      },
    },
  })

  if (!course) throw new AppError(404, 'Kurs topilmadi')

  if (!userId) return { course, completed: [] as string[], currentLessonId: null }

  // Foydalanuvchining yakunlangan darslari
  const lessonIds = course.units.flatMap((u) => u.lessons.map((l) => l.id))
  const results = await prisma.lessonResult.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true },
  })
  const completed = [...new Set(results.map((r) => r.lessonId))]

  // Kursdagi navbatdagi (current) dars
  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })

  let currentLessonId = progress?.currentLessonId ?? null
  if (!currentLessonId) {
    for (const u of course.units) {
      for (const l of u.lessons) {
        if (!completed.includes(l.id)) {
          currentLessonId = l.id
          break
        }
      }
      if (currentLessonId) break
    }
  }

  return { course, completed, currentLessonId }
}

export async function enrollInCourse(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw new AppError(404, 'Kurs topilmadi')

  return prisma.courseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  })
}
