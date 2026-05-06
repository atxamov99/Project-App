import bcrypt from 'bcryptjs'
import { prisma } from '../../config/db'
import { env } from '../../config/env'
import { signToken } from '../../utils/jwt'
import { AppError } from '../../middleware/error'
import type { LoginInput, RegisterInput } from './auth.schemas'

function publicUser(user: { id: string; email: string; username: string; displayName: string; avatar: string | null; gems: number; totalXP: number; streak: number }) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    gems: user.gems,
    totalXP: user.totalXP,
    streak: user.streak,
  }
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
    select: { email: true, username: true },
  })

  if (existing) {
    if (existing.email === input.email) {
      throw new AppError(409, 'Bu email bilan foydalanuvchi mavjud')
    }
    throw new AppError(409, 'Bu username band')
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      displayName: input.displayName,
      passwordHash,
      lives: { create: {} },
    },
  })

  const token = signToken({ userId: user.id })
  return { user: publicUser(user), token }
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new AppError(401, 'Email yoki parol noto\'g\'ri')

  const ok = await bcrypt.compare(input.password, user.passwordHash)
  if (!ok) throw new AppError(401, 'Email yoki parol noto\'g\'ri')

  const token = signToken({ userId: user.id })
  return { user: publicUser(user), token }
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { lives: true },
  })
  if (!user) throw new AppError(404, 'Foydalanuvchi topilmadi')

  return {
    ...publicUser(user),
    lives: user.lives ? { current: user.lives.current, max: user.lives.max, refillAt: user.lives.refillAt } : null,
    longestStreak: user.longestStreak,
    isPremium: user.isPremium,
  }
}
