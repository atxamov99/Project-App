import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

const PUBLIC_FIELDS = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  totalXP: true,
  streak: true,
  longestStreak: true,
  isPremium: true,
  createdAt: true,
} as const

export async function getPublicProfile(viewerId: string, username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...PUBLIC_FIELDS,
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
    stats: {
      lessonsCompleted: user._count.lessonResults,
      achievements: user._count.achievements,
      following: user._count.following,
      followers: user._count.followers,
    },
    league: user.leagueEntry?.league ?? null,
    weeklyXP: user.leagueEntry?.weeklyXP ?? 0,
    isSelf,
    isFollowing,
    followsYou,
  }
}
