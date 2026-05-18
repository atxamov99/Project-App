import { Prisma, Role } from '@prisma/client'
import { prisma } from '../../../config/db'
import { AppError } from '../../../middleware/error'
import type { ListUsersQuery } from './admin-users.schemas'

const PUBLIC_FIELDS = {
  id: true,
  email: true,
  username: true,
  displayName: true,
  avatar: true,
  role: true,
  suspendedAt: true,
  suspendReason: true,
  adminNote: true,
  gems: true,
  totalXP: true,
  streak: true,
  longestStreak: true,
  lastActiveAt: true,
  isPremium: true,
  premiumUntil: true,
  createdAt: true,
} satisfies Prisma.UserSelect

export async function listUsers(q: ListUsersQuery) {
  const where: Prisma.UserWhereInput = {}
  if (q.role) where.role = q.role
  if (q.suspended === 'true') where.suspendedAt = { not: null }
  if (q.suspended === 'false') where.suspendedAt = null
  if (q.premium === 'true') where.isPremium = true
  if (q.premium === 'false') where.isPremium = false
  if (q.search) {
    where.OR = [
      { email: { contains: q.search, mode: 'insensitive' } },
      { username: { contains: q.search, mode: 'insensitive' } },
      { displayName: { contains: q.search, mode: 'insensitive' } },
    ]
  }

  const orderBy: Prisma.UserOrderByWithRelationInput = q.sort === 'totalXP'
    ? { totalXP: 'desc' }
    : q.sort === 'streak'
    ? { streak: 'desc' }
    : { createdAt: 'desc' }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      select: PUBLIC_FIELDS,
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, page: q.page, limit: q.limit }
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...PUBLIC_FIELDS,
      lives: true,
      _count: {
        select: {
          lessonResults: true,
          progress: true,
          achievements: true,
        },
      },
    },
  })
  if (!user) throw new AppError(404, 'Foydalanuvchi topilmadi')
  return user
}

async function ensureNotLastAdminLocked(targetId: string, currentUserId: string) {
  if (targetId === currentUserId) {
    throw new AppError(422, "O'z rolingizni o'zgartira olmaysiz")
  }
}

async function ensureNotLastAdmin(targetId: string) {
  const target = await prisma.user.findUnique({ where: { id: targetId }, select: { role: true } })
  if (target?.role === 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    if (adminCount === 1) {
      throw new AppError(422, "Oxirgi ADMIN'ga teginib bo'lmaydi")
    }
  }
}

export async function changeRole(currentUserId: string, targetId: string, role: Role) {
  await ensureNotLastAdminLocked(targetId, currentUserId)
  await ensureNotLastAdmin(targetId)

  const before = await prisma.user.findUnique({ where: { id: targetId }, select: { role: true } })
  if (!before) throw new AppError(404, 'Foydalanuvchi topilmadi')

  const updated = await prisma.user.update({
    where: { id: targetId },
    data: { role },
    select: PUBLIC_FIELDS,
  })

  return { user: updated, before: before.role, after: role }
}

export async function suspendUser(currentUserId: string, targetId: string, reason: string) {
  if (targetId === currentUserId) {
    throw new AppError(422, "O'zingizni suspend qila olmaysiz")
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data: { suspendedAt: new Date(), suspendReason: reason },
    select: PUBLIC_FIELDS,
  })
  return updated
}

export async function unsuspendUser(targetId: string) {
  const updated = await prisma.user.update({
    where: { id: targetId },
    data: { suspendedAt: null, suspendReason: null },
    select: PUBLIC_FIELDS,
  })
  return updated
}

export async function setPremium(targetId: string, isPremium: boolean, days?: number) {
  const user = await prisma.user.findUnique({ where: { id: targetId }, select: { premiumUntil: true } })
  if (!user) throw new AppError(404, 'Foydalanuvchi topilmadi')

  let premiumUntil: Date | null = null
  if (isPremium) {
    const dayCount = days && days > 0 ? days : 30
    const now = new Date()
    const base = user.premiumUntil && user.premiumUntil > now ? user.premiumUntil : now
    premiumUntil = new Date(base.getTime() + dayCount * 24 * 60 * 60 * 1000)
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data: { isPremium, premiumUntil },
    select: PUBLIC_FIELDS,
  })
  return updated
}

export async function deleteUser(currentUserId: string, targetId: string) {
  if (targetId === currentUserId) {
    throw new AppError(422, "O'zingizni o'chira olmaysiz")
  }
  await ensureNotLastAdmin(targetId)

  // Audit log restrict cascade — admin tomonidan yozilgan loglar bo'lsa, o'chirish uzilib qoladi.
  // Bu xavfsizlik xususiyati: ADMIN faqat hech qanday admin amal qilmaganidagina o'chiriladi.
  await prisma.user.delete({ where: { id: targetId } })
  return { id: targetId }
}
