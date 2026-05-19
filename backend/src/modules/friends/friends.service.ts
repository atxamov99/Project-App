import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

const PUBLIC_FIELDS = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  totalXP: true,
  streak: true,
} as const

export async function listFollowing(userId: string) {
  const links = await prisma.friendship.findMany({
    where: { followerId: userId },
    include: { following: { select: PUBLIC_FIELDS } },
    orderBy: { createdAt: 'desc' },
  })
  return links.map((l) => l.following)
}

export async function listFollowers(userId: string) {
  const links = await prisma.friendship.findMany({
    where: { followingId: userId },
    include: { follower: { select: PUBLIC_FIELDS } },
    orderBy: { createdAt: 'desc' },
  })
  return links.map((l) => l.follower)
}

export async function followUser(followerId: string, username: string) {
  const target = await prisma.user.findUnique({ where: { username }, select: PUBLIC_FIELDS })
  if (!target) throw new AppError(404, 'Foydalanuvchi topilmadi')
  if (target.id === followerId) throw new AppError(422, "O'zingizga obuna bo'la olmaysiz")

  const existing = await prisma.friendship.findUnique({
    where: { followerId_followingId: { followerId, followingId: target.id } },
  })
  if (existing) throw new AppError(409, "Allaqachon obuna bo'lgansiz")

  await prisma.friendship.create({
    data: { followerId, followingId: target.id },
  })

  return target
}

export async function unfollowUser(followerId: string, followingId: string) {
  await prisma.friendship.delete({
    where: { followerId_followingId: { followerId, followingId } },
  }).catch(() => {
    throw new AppError(404, 'Obuna topilmadi')
  })
  return { ok: true }
}

export async function searchUsers(currentUserId: string, q: string) {
  if (!q || q.length < 2) return []

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } },
        { suspendedAt: null },
        {
          OR: [
            { username: { contains: q } },
            { displayName: { contains: q } },
          ],
        },
      ],
    },
    select: PUBLIC_FIELDS,
    take: 20,
    orderBy: { totalXP: 'desc' },
  })

  // Annotate each with whether current user already follows them
  const followed = await prisma.friendship.findMany({
    where: { followerId: currentUserId, followingId: { in: users.map((u) => u.id) } },
    select: { followingId: true },
  })
  const followedSet = new Set(followed.map((f) => f.followingId))

  return users.map((u) => ({ ...u, isFollowing: followedSet.has(u.id) }))
}
