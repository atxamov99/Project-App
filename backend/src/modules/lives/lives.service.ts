import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

const MAX_LIVES = 5
const REFILL_MINUTES = 30
const LIFE_GEM_COST = 30

export async function getLives(userId: string) {
  const lives = await prisma.userLives.upsert({
    where: { userId },
    update: {},
    create: { userId, current: MAX_LIVES, max: MAX_LIVES },
  })

  // Lazy refill: agar refillAt o'tib ketgan bo'lsa va max'dan kam bo'lsa
  if (lives.refillAt && lives.refillAt <= new Date() && lives.current < lives.max) {
    return refillSingleUser(userId)
  }
  return lives
}

export async function deductLife(userId: string) {
  const lives = await getLives(userId)
  if (lives.current <= 0) {
    throw new AppError(403, 'Hayot tugadi! Kuting yoki gem bilan sotib oling.')
  }

  const newCount = lives.current - 1
  const refillAt = newCount < lives.max
    ? new Date(Date.now() + REFILL_MINUTES * 60_000)
    : null

  return prisma.userLives.update({
    where: { userId },
    data: { current: newCount, refillAt },
  })
}

export async function buyLives(userId: string, count = MAX_LIVES) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { gems: true } })
  if (!user) throw new AppError(404, 'Foydalanuvchi topilmadi')

  const totalCost = LIFE_GEM_COST * count
  if (user.gems < totalCost) throw new AppError(400, `Yetarli gem yo\'q (${totalCost} kerak)`)

  await prisma.user.update({ where: { id: userId }, data: { gems: { decrement: totalCost } } })

  return prisma.userLives.upsert({
    where: { userId },
    update: { current: MAX_LIVES, refillAt: null },
    create: { userId, current: MAX_LIVES, max: MAX_LIVES },
  })
}

async function refillSingleUser(userId: string) {
  const lives = await prisma.userLives.findUnique({ where: { userId } })
  if (!lives) throw new AppError(404, 'Lives topilmadi')

  const now = new Date()
  if (!lives.refillAt || lives.refillAt > now) return lives

  const elapsedMs = now.getTime() - lives.refillAt.getTime()
  const refilledCount = 1 + Math.floor(elapsedMs / (REFILL_MINUTES * 60_000))
  const newCount = Math.min(lives.current + refilledCount, lives.max)

  const refillAt = newCount < lives.max
    ? new Date(now.getTime() + REFILL_MINUTES * 60_000)
    : null

  return prisma.userLives.update({
    where: { userId },
    data: { current: newCount, refillAt },
  })
}

// Cron uchun: barcha foydalanuvchilarning hayotlarini yangilash
export async function refillAllLives() {
  const now = new Date()
  const needsRefill = await prisma.userLives.findMany({
    where: { current: { lt: MAX_LIVES }, refillAt: { lte: now } },
    select: { userId: true },
  })

  for (const { userId } of needsRefill) {
    await refillSingleUser(userId).catch(() => {})
  }

  return { processed: needsRefill.length }
}
