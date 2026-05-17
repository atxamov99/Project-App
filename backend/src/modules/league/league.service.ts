import { prisma } from '../../config/db'
import { weekStart } from '../../utils/week'

const GROUP_SIZE = 30

async function ensureLowestLeague() {
  const lowest = await prisma.league.findFirst({ orderBy: { order: 'asc' } })
  if (!lowest) throw new Error('Liga ma\'lumotlari yo\'q (seed kerak)')
  return lowest
}

async function ensureEntry(userId: string) {
  const existing = await prisma.leagueEntry.findUnique({ where: { userId }, include: { league: true } })
  if (existing) return existing

  const lowest = await ensureLowestLeague()
  const ws = weekStart()
  const groupId = `${lowest.id}-${ws.toISOString().slice(0, 10)}-1`

  return prisma.leagueEntry.create({
    data: { userId, leagueId: lowest.id, groupId, weeklyXP: 0, weekStart: ws },
    include: { league: true },
  })
}

export async function getLeague(userId: string) {
  const entry = await ensureEntry(userId)

  // Hali entry yo'q bo'lgan boshqa userlarni ham shu ligaga qo'shamiz
  const lowest = await ensureLowestLeague()
  const ws = weekStart()
  const groupId = `${lowest.id}-${ws.toISOString().slice(0, 10)}-1`

  const usersWithoutEntry = await prisma.user.findMany({
    where: { leagueEntry: null, suspendedAt: null },
    select: { id: true },
  })
  if (usersWithoutEntry.length > 0) {
    await prisma.leagueEntry.createMany({
      data: usersWithoutEntry.map((u) => ({
        userId: u.id,
        leagueId: lowest.id,
        groupId,
        weeklyXP: 0,
        weekStart: ws,
      })),
      skipDuplicates: true,
    })
  }

  // Shu ligadagi barcha userlar (groupId qattiq filter emas — kam userda bir guruh)
  const leaderboard = await prisma.leagueEntry.findMany({
    where: { leagueId: entry.leagueId },
    orderBy: [{ weeklyXP: 'desc' }, { user: { totalXP: 'desc' } }],
    take: GROUP_SIZE,
    include: {
      user: { select: { username: true, displayName: true, avatar: true, totalXP: true, suspendedAt: true } },
    },
  })

  const visible = leaderboard.filter((e) => !e.user.suspendedAt)
  const myRank = visible.findIndex((e) => e.userId === userId) + 1

  return {
    league: entry.league,
    weekStart: entry.weekStart,
    weeklyXP: entry.weeklyXP,
    rank: myRank || null,
    leaderboard: visible.map((e, i) => ({
      rank: i + 1,
      userId: e.userId,
      username: e.user.username,
      displayName: e.user.displayName,
      avatar: e.user.avatar,
      weeklyXP: e.weeklyXP,
      totalXP: e.user.totalXP,
      isYou: e.userId === userId,
    })),
  }
}

export async function addWeeklyXP(userId: string, xp: number) {
  const entry = await ensureEntry(userId)
  return prisma.leagueEntry.update({
    where: { id: entry.id },
    data: { weeklyXP: { increment: xp } },
    select: { weeklyXP: true },
  })
}
