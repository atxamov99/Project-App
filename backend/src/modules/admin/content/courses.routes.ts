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
  fromLanguageId: z.string().min(1),
  toLanguageId: z.string().min(1),
})

const updateSchema = z.object({
  isActive: z.boolean().optional(),
})

const list: RequestHandler = async (_req, res) => {
  const courses = await prisma.course.findMany({
    include: {
      fromLanguage: true,
      toLanguage: true,
      _count: { select: { units: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
  res.json({ courses })
}

const get: RequestHandler = async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      fromLanguage: true,
      toLanguage: true,
      units: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { lessons: true } } },
      },
    },
  })
  if (!course) throw new AppError(404, 'Kurs topilmadi')
  res.json({ course })
}

const create: RequestHandler = async (req, res) => {
  if (req.body.fromLanguageId === req.body.toLanguageId) {
    throw new AppError(422, "Manba va maqsad til bir xil bo'lmasin")
  }

  const exists = await prisma.course.findUnique({
    where: {
      fromLanguageId_toLanguageId: {
        fromLanguageId: req.body.fromLanguageId,
        toLanguageId: req.body.toLanguageId,
      },
    },
  })
  if (exists) throw new AppError(409, 'Bunday kurs allaqachon mavjud')

  const course = await prisma.course.create({ data: req.body })
  await logAction({
    ...actorContext(req), action: 'course.create',
    targetType: 'course', targetId: course.id, metadata: req.body,
  })
  res.status(201).json({ course })
}

const update: RequestHandler = async (req, res) => {
  const course = await prisma.course.update({ where: { id: req.params.id }, data: req.body })
  await logAction({
    ...actorContext(req), action: 'course.update',
    targetType: 'course', targetId: course.id, metadata: req.body,
  })
  res.json({ course })
}

const remove: RequestHandler = async (req, res) => {
  await prisma.course.delete({ where: { id: req.params.id } })
  await logAction({
    ...actorContext(req), action: 'course.delete',
    targetType: 'course', targetId: req.params.id,
  })
  res.json({ ok: true })
}

router.get('/', list)
router.get('/:id', get)
router.post('/', validateBody(createSchema), create)
router.patch('/:id', validateBody(updateSchema), update)
router.delete('/:id', remove)

export default router
