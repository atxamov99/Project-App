import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../../config/db'
import { env } from '../../config/env'
import { signToken } from '../../utils/jwt'
import { AppError } from '../../middleware/error'
import type { GoogleLoginInput, LoginInput, RegisterInput } from './auth.schemas'

const googleClient = env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID)
  : null

type UserRole = 'STUDENT' | 'CONTENT_EDITOR' | 'ADMIN'

type UserLike = {
  id: string
  email: string
  username: string
  displayName: string
  avatar: string | null
  gems: number
  totalXP: number
  streak: number
  role?: string
  suspendedAt?: Date | null
}

function normalizeRole(role?: string | null): UserRole {
  if (role === 'ADMIN' || role === 'CONTENT_EDITOR' || role === 'STUDENT') {
    return role
  }
  return 'STUDENT'
}

function publicUser(user: UserLike) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    gems: user.gems,
    totalXP: user.totalXP,
    streak: user.streak,
    role: normalizeRole(user.role),
    suspendedAt: user.suspendedAt ?? null,
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

  if (!user.passwordHash) {
    throw new AppError(401, 'Bu hisob faqat Google orqali kirishi mumkin')
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash)
  if (!ok) throw new AppError(401, 'Email yoki parol noto\'g\'ri')

  const token = signToken({ userId: user.id })
  return { user: publicUser(user), token }
}

async function uniqueUsernameFromEmail(email: string): Promise<string> {
  const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 18) || 'user'
  for (let i = 0; i < 6; i++) {
    const candidate = i === 0 ? base : `${base}${Math.floor(Math.random() * 9000 + 1000)}`
    const exists = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })
    if (!exists) return candidate
  }
  return `${base}${Date.now().toString(36)}`
}

export async function googleLogin(input: GoogleLoginInput) {
  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    throw new AppError(503, 'Google login sozlanmagan')
  }

  let payload
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: env.GOOGLE_CLIENT_ID,
    })
    payload = ticket.getPayload()
  } catch {
    throw new AppError(401, 'Yaroqsiz Google token')
  }

  if (!payload?.sub || !payload.email) {
    throw new AppError(401, 'Google token to\'liq emas')
  }
  if (!payload.email_verified) {
    throw new AppError(401, 'Google email tasdiqlanmagan')
  }

  const googleId = payload.sub
  const email = payload.email
  const displayName = payload.name || email.split('@')[0]
  const avatar = payload.picture ?? null

  let user = await prisma.user.findUnique({ where: { googleId } })

  if (!user) {
    const byEmail = await prisma.user.findUnique({ where: { email } })
    if (byEmail) {
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: { googleId, avatar: byEmail.avatar ?? avatar },
      })
    } else {
      const username = await uniqueUsernameFromEmail(email)
      user = await prisma.user.create({
        data: {
          email,
          username,
          displayName,
          avatar,
          googleId,
          lives: { create: {} },
        },
      })
    }
  }

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
