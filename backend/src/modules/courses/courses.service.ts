import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

type LessonStatus = 'locked' | 'available' | 'completed' | 'current'

export async function getCurrentCourse(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { targetLanguage: true },
  })
  if (!user) throw new AppError(404, 'Foydalanuvchi topilmadi')

  const where = user.targetLanguage
    ? { isActive: true, toLanguage: { code: user.targetLanguage } }
    : { isActive: true }

  const course = await prisma.course.findFirst({
    where,
    include: {
      fromLanguage: true,
      toLanguage: true,
      units: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, order: true, type: true, xpReward: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
  if (!course) throw new AppError(404, 'Kurs topilmadi')

  const lessonIds = course.units.flatMap((u) => u.lessons.map((l) => l.id))
  const results = await prisma.lessonResult.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true },
  })
  const completed = new Set(results.map((r) => r.lessonId))

  let foundCurrent = false
  const units = course.units.map((u) => ({
    ...u,
    lessons: u.lessons.map((l) => {
      let status: LessonStatus
      if (completed.has(l.id)) status = 'completed'
      else if (!foundCurrent) { status = 'current'; foundCurrent = true }
      else status = 'locked'
      return { id: l.id, order: l.order, type: l.type, status }
    }),
  }))

  return { ...course, units }
}

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

  // Agar saqlangan currentLessonId yakunlangan bo'lsa yoki yo'q bo'lsa — keyingi yakunlanmagan darsni topish
  let currentLessonId = progress?.currentLessonId ?? null
  const completedSet = new Set(completed)
  if (!currentLessonId || completedSet.has(currentLessonId)) {
    currentLessonId = null
    for (const u of course.units) {
      for (const l of u.lessons) {
        if (!completedSet.has(l.id)) {
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
