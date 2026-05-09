import { Router, RequestHandler } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../../middleware/auth'
import { requireContentEditor } from '../../../middleware/requireContentEditor'
import { validateBody } from '../../../middleware/validate'
import { prisma } from '../../../config/db'
import { AppError } from '../../../middleware/error'
import { actorContext, logAction } from '../audit/audit.service'

const router = Router()
router.use(requireAuth, requireContentEditor)

const createSchema = z.object({
  key: z.string().min(2).max(50).regex(/^[A-Z0-9_]+$/, 'UPPERCASE va _ qabul qilinadi'),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  icon: z.string().min(1).max(10),
  gemReward: z.coerce.number().int().min(0).max(10000).default(0),
  xpReward: z.coerce.number().int().min(0).max(10000).default(0),
})

const updateSchema = createSchema.partial().omit({ key: true })

const list: RequestHandler = async (_req, res) => {
  const achievements = await prisma.achievement.findMany({ orderBy: { key: 'asc' } })
  res.json({ achievements })
}

const create: RequestHandler = async (req, res) => {
  const exists = await prisma.achievement.findUnique({ where: { key: req.body.key } })
  if (exists) throw new AppError(409, 'Yutuq kaliti band')

  const achievement = await prisma.achievement.create({ data: req.body })
  await logAction({
    ...actorContext(req), action: 'achievement.create',
    targetType: 'achievement', targetId: achievement.id, metadata: req.body,
  })
  res.status(201).json({ achievement })
}

const update: RequestHandler = async (req, res) => {
  const achievement = await prisma.achievement.update({ where: { id: req.params.id }, data: req.body })
  await logAction({
    ...actorContext(req), action: 'achievement.update',
    targetType: 'achievement', targetId: achievement.id, metadata: req.body,
  })
  res.json({ achievement })
}

const remove: RequestHandler = async (req, res) => {
  await prisma.achievement.delete({ where: { id: req.params.id } })
  await logAction({
    ...actorContext(req), action: 'achievement.delete',
    targetType: 'achievement', targetId: req.params.id,
  })
  res.json({ ok: true })
}

router.get('/', list)
router.post('/', validateBody(createSchema), create)
router.patch('/:id', validateBody(updateSchema), update)
router.delete('/:id', remove)

export default router
