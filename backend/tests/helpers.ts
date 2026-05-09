import { prisma } from '../src/config/db'

export async function cleanDatabase() {
  // Tartib muhim — child birinchi
  await prisma.exerciseWord.deleteMany()
  await prisma.lessonExercise.deleteMany()
  await prisma.wordProgress.deleteMany()
  await prisma.lessonResult.deleteMany()
  await prisma.userAchievement.deleteMany()
  await prisma.leagueEntry.deleteMany()
  await prisma.session.deleteMany()
  await prisma.userLives.deleteMany()
  await prisma.courseProgress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.exercise.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.course.deleteMany()
  await prisma.word.deleteMany()
}

export function uniqueEmail(prefix = 'test'): string {
  return `${prefix}+${Date.now()}-${Math.floor(Math.random() * 9999)}@example.com`
}

export function uniqueUsername(prefix = 'user'): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 9999)}`.slice(0, 20)
}
