import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/db'

export async function requireContentEditor(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Avtorizatsiya talab etiladi' })
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true, suspendedAt: true },
  })

  if (!user) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' })
  if (user.suspendedAt) return res.status(403).json({ error: 'Hisob to\'xtatilgan' })
  if (!['CONTENT_EDITOR', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Faqat CONTENT_EDITOR yoki ADMIN' })
  }

  next()
}
