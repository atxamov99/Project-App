import { prisma } from '../../config/db'
import { AppError } from '../../middleware/error'

const PLANS = {
  PLUS: { priceUzs: 19900, days: 30, label: 'Plus' },
  MAX:  { priceUzs: 39900, days: 30, label: 'Max'  },
} as const

export type Plan = keyof typeof PLANS

export async function subscribe(userId: string, plan: Plan) {
  const planDef = PLANS[plan]
  if (!planDef) throw new AppError(400, "Noto'g'ri tarif rejasi")

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError(404, 'Foydalanuvchi topilmadi')

  // Hozirgi premiumUntil dan davom etamiz yoki yangidan boshlaymiz
  const now = new Date()
  const base = user.premiumUntil && user.premiumUntil > now ? user.premiumUntil : now
  const newUntil = new Date(base.getTime() + planDef.days * 24 * 60 * 60 * 1000)

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isPremium: true, premiumUntil: newUntil },
    select: { id: true, isPremium: true, premiumUntil: true },
  })

  return {
    plan,
    label: planDef.label,
    priceUzs: planDef.priceUzs,
    isPremium: updated.isPremium,
    premiumUntil: updated.premiumUntil,
  }
}

export async function cancel(userId: string) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isPremium: false, premiumUntil: null },
    select: { id: true, isPremium: true, premiumUntil: true },
  })
  return updated
}

export function listPlans() {
  return Object.entries(PLANS).map(([key, def]) => ({
    key,
    label: def.label,
    priceUzs: def.priceUzs,
    days: def.days,
  }))
}
