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
  unitId: z.string().min(1),
  order: z.coerce.number().int().min(1),
  type: z.enum(['REGULAR', 'CHECKPOINT', 'PRACTICE', 'STORY']).default('REGULAR'),
  xpReward: z.coerce.number().int().min(1).max(100).default(10),
})

const updateSchema = createSchema.partial().omit({ unitId: true })

const listByUnit: RequestHandler = async (req, res) => {
  const lessons = await prisma.lesson.findMany({
    where: { unitId: req.params.unitId },
    orderBy: { order: 'asc' },
    include: { _count: { select: { exercises: true } } },
  })
  res.json({ lessons })
}

const get: RequestHandler = async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: req.params.id },
    include: {
      unit: { include: { course: true } },
      exercises: {
        orderBy: { order: 'asc' },
        include: { exercise: true },
      },
    },
  })
  if (!lesson) throw new AppError(404, 'Dars topilmadi')
  res.json({ lesson })
}

const create: RequestHandler = async (req, res) => {
  const lesson = await prisma.lesson.create({ data: req.body })
  await logAction({
    ...actorContext(req), action: 'lesson.create',
    targetType: 'lesson', targetId: lesson.id, metadata: req.body,
  })
  res.status(201).json({ lesson })
}

const update: RequestHandler = async (req, res) => {
  const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: req.body })
  await logAction({
    ...actorContext(req), action: 'lesson.update',
    targetType: 'lesson', targetId: lesson.id, metadata: req.body,
  })
  res.json({ lesson })
}

const remove: RequestHandler = async (req, res) => {
  await prisma.lesson.delete({ where: { id: req.params.id } })
  await logAction({
    ...actorContext(req), action: 'lesson.delete',
    targetType: 'lesson', targetId: req.params.id,
  })
  res.json({ ok: true })
}

router.get('/by-unit/:unitId', listByUnit)
router.get('/:id', get)
router.post('/', validateBody(createSchema), create)
router.patch('/:id', validateBody(updateSchema), update)
router.delete('/:id', remove)

export default router
