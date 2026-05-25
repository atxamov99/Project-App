import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

const SUPPORTED_LANGS = new Set(['uz', 'en', 'ru'])

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { lives: true },
  })
  if (!user) throw new AppError(404, 'Foydalanuvchi topilmadi')

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    gems: user.gems,
    totalXP: user.totalXP,
    streak: user.streak,
    longestStreak: user.longestStreak,
    streakFreezes: user.streakFreezes,
    isPremium: user.isPremium,
    interfaceLanguage: user.interfaceLanguage,
    targetLanguage: user.targetLanguage,
    lives: user.lives
      ? { current: user.lives.current, max: user.lives.max, refillAt: user.lives.refillAt }
      : null,
  }
}

export async function updateLanguages(
  userId: string,
  interfaceLanguage: string,
  targetLanguage: string,
) {
  if (!SUPPORTED_LANGS.has(interfaceLanguage) || !SUPPORTED_LANGS.has(targetLanguage)) {
    throw new AppError(400, 'Yaroqsiz til kodi')
  }
  if (interfaceLanguage === targetLanguage) {
    throw new AppError(400, 'Interfeys va o\'rganish tili bir xil bo\'lishi mumkin emas')
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { interfaceLanguage, targetLanguage },
    select: { interfaceLanguage: true, targetLanguage: true },
  })

  return user
}

export async function getPublicProfile(viewerId: string, username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      totalXP: true,
      streak: true,
      longestStreak: true,
      isPremium: true,
      createdAt: true,
      suspendedAt: true,
      _count: {
        select: {
          lessonResults: true,
          achievements: true,
          following: true,
          followers: true,
        },
      },
      leagueEntry: { include: { league: true } },
    },
  })
  if (!user || user.suspendedAt) throw new AppError(404, 'Foydalanuvchi topilmadi')

  const isSelf = user.id === viewerId

  let isFollowing = false
  let followsYou = false
  if (!isSelf) {
    const [f1, f2] = await Promise.all([
      prisma.friendship.findUnique({
        where: { followerId_followingId: { followerId: viewerId, followingId: user.id } },
        select: { followerId: true },
      }),
      prisma.friendship.findUnique({
        where: { followerId_followingId: { followerId: user.id, followingId: viewerId } },
        select: { followerId: true },
      }),
    ])
    isFollowing = !!f1
    followsYou = !!f2
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    totalXP: user.totalXP,
    streak: user.streak,
    longestStreak: user.longestStreak,
    isPremium: user.isPremium,
    createdAt: user.createdAt,
    isSelf,
    isFollowing,
    followsYou,
    counts: {
      lessonResults: user._count.lessonResults,
      achievements: user._count.achievements,
      following: user._count.following,
      followers: user._count.followers,
    },
    leagueEntry: user.leagueEntry
      ? {
          weeklyXP: user.leagueEntry.weeklyXP,
          league: {
            name: user.leagueEntry.league.name,
            color: user.leagueEntry.league.color,
            icon: user.leagueEntry.league.icon,
          },
        }
      : null,
  }
}
