import { Router, RequestHandler } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../../middleware/auth'
import { requireContentEditor } from '../../../middleware/requireContentEditor'
import { validateBody } from '../../../middleware/validate'
import { prisma } from '../../../config/db'
import { actorContext, logAction } from '../audit/audit.service'

const router = Router()
router.use(requireAuth, requireContentEditor)

const createSchema = z.object({
  courseId: z.string().min(1),
  order: z.coerce.number().int().min(1),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().min(1).max(20).default('#a03f2e'),
  icon: z.string().min(1).max(10).default('📚'),
})

const updateSchema = createSchema.partial().omit({ courseId: true })

const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1),
    order: z.coerce.number().int().min(1),
  })).min(1),
})

const listByCourse: RequestHandler = async (req, res) => {
  const units = await prisma.unit.findMany({
    where: { courseId: req.params.courseId },
    orderBy: { order: 'asc' },
    include: { _count: { select: { lessons: true } } },
  })
  res.json({ units })
}

const create: RequestHandler = async (req, res) => {
  const unit = await prisma.unit.create({ data: req.body })
  await logAction({
    ...actorContext(req), action: 'unit.create',
    targetType: 'unit', targetId: unit.id, metadata: req.body,
  })
  res.status(201).json({ unit })
}

const update: RequestHandler = async (req, res) => {
  const unit = await prisma.unit.update({ where: { id: req.params.id }, data: req.body })
  await logAction({
    ...actorContext(req), action: 'unit.update',
    targetType: 'unit', targetId: unit.id, metadata: req.body,
  })
  res.json({ unit })
}

const remove: RequestHandler = async (req, res) => {
  await prisma.unit.delete({ where: { id: req.params.id } })
  await logAction({
    ...actorContext(req), action: 'unit.delete',
    targetType: 'unit', targetId: req.params.id,
  })
  res.json({ ok: true })
}

const reorder: RequestHandler = async (req, res) => {
  await prisma.$transaction(
    req.body.items.map((it: { id: string; order: number }) =>
      prisma.unit.update({ where: { id: it.id }, data: { order: it.order } }),
    ),
  )
  await logAction({
    ...actorContext(req), action: 'unit.reorder',
    metadata: { items: req.body.items },
  })
  res.json({ ok: true })
}

router.get('/by-course/:courseId', listByCourse)
router.post('/', validateBody(createSchema), create)
router.patch('/:id', validateBody(updateSchema), update)
router.delete('/:id', remove)
router.post('/reorder', validateBody(reorderSchema), reorder)

export default router
