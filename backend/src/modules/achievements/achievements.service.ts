import { prisma } from '../../config/db'

const STREAK_MILESTONES: Record<number, string> = {
  7: 'STREAK_7',
  30: 'STREAK_30',
  100: 'STREAK_100',
}

const WORDS_MILESTONES: Record<number, string> = {
  100: 'WORDS_100',
}

export interface GrantedAchievement {
  key: string
  title: string
  gemReward: number
  xpReward: number
}

async function grantOne(userId: string, key: string): Promise<GrantedAchievement | null> {
  const achievement = await prisma.achievement.findUnique({ where: { key } })
  if (!achievement) return null

  const exists = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
  })
  if (exists) return null

  await prisma.userAchievement.create({
    data: { userId, achievementId: achievement.id },
  })

  if (achievement.gemReward || achievement.xpReward) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { increment: achievement.gemReward },
        totalXP: { increment: achievement.xpReward },
      },
    })
  }

  return {
    key: achievement.key,
    title: achievement.title,
    gemReward: achievement.gemReward,
    xpReward: achievement.xpReward,
  }
}

export async function checkAfterLesson(userId: string, streak: number): Promise<GrantedAchievement[]> {
  const granted: GrantedAchievement[] = []

  // Streak yutuqlari
  const streakKey = STREAK_MILESTONES[streak]
  if (streakKey) {
    const got = await grantOne(userId, streakKey)
    if (got) granted.push(got)
  }

  // So'z yutuqlari (ma'lum sondagi mustahkamlangan so'zlar)
  const learnedCount = await prisma.wordProgress.count({
    where: { userId, strength: { gte: 4 } },
  })

  for (const [milestoneStr, key] of Object.entries(WORDS_MILESTONES)) {
    if (learnedCount >= Number(milestoneStr)) {
      const got = await grantOne(userId, key)
      if (got) granted.push(got)
    }
  }

  return granted
}
