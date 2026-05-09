import { prisma } from '../../config/db'

function dateKey(d: Date): string {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString().slice(0, 10)
}

export async function updateStreak(userId: string): Promise<{ streak: number; isNew: boolean; longestStreak: number }> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Foydalanuvchi topilmadi')

  const todayKey = dateKey(new Date())
  const lastKey = user.lastActiveAt ? dateKey(user.lastActiveAt) : null

  if (lastKey === todayKey) {
    return { streak: user.streak, isNew: false, longestStreak: user.longestStreak }
  }

  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yesterdayKey = dateKey(yesterday)

  let newStreak: number
  if (lastKey === yesterdayKey) {
    newStreak = user.streak + 1
  } else if (user.streakFreezes > 0 && lastKey) {
    newStreak = user.streak
    await prisma.user.update({
      where: { id: userId },
      data: { streakFreezes: { decrement: 1 } },
    })
  } else {
    newStreak = 1
  }

  const longestStreak = Math.max(newStreak, user.longestStreak)

  await prisma.user.update({
    where: { id: userId },
    data: { streak: newStreak, longestStreak, lastActiveAt: new Date() },
  })

  return { streak: newStreak, isNew: newStreak > user.streak, longestStreak }
}

export async function getStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, longestStreak: true, lastActiveAt: true, streakFreezes: true },
  })
  if (!user) throw new Error('Foydalanuvchi topilmadi')
  return user
}

export async function buyStreakFreeze(userId: string, cost = 50) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Foydalanuvchi topilmadi')
  if (user.gems < cost) throw new Error('Yetarli gem yo\'q')

  return prisma.user.update({
    where: { id: userId },
    data: {
      gems: { decrement: cost },
      streakFreezes: { increment: 1 },
    },
    select: { gems: true, streakFreezes: true },
  })
}
