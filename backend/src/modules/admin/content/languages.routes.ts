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
  code: z.string().min(2).max(5).toLowerCase(),
  name: z.string().min(1).max(50),
  nativeName: z.string().min(1).max(50),
  flag: z.string().min(1).max(10),
  isActive: z.boolean().default(true),
})

const updateSchema = createSchema.partial()

const list: RequestHandler = async (_req, res) => {
  const languages = await prisma.language.findMany({ orderBy: { code: 'asc' } })
  res.json({ languages })
}

const create: RequestHandler = async (req, res) => {
  const exists = await prisma.language.findUnique({ where: { code: req.body.code } })
  if (exists) throw new AppError(409, 'Til kodi band')

  const language = await prisma.language.create({ data: req.body })
  await logAction({
    ...actorContext(req), action: 'language.create',
    targetType: 'language', targetId: language.id, metadata: req.body,
  })
  res.status(201).json({ language })
}

const update: RequestHandler = async (req, res) => {
  const language = await prisma.language.update({ where: { id: req.params.id }, data: req.body })
  await logAction({
    ...actorContext(req), action: 'language.update',
    targetType: 'language', targetId: language.id, metadata: req.body,
  })
  res.json({ language })
}

const remove: RequestHandler = async (req, res) => {
  const usedAsFrom = await prisma.course.count({ where: { fromLanguageId: req.params.id } })
  const usedAsTo = await prisma.course.count({ where: { toLanguageId: req.params.id } })
  if (usedAsFrom + usedAsTo > 0) {
    throw new AppError(422, 'Til kurslarda ishlatilmoqda — avval kurslarni o\'chiring')
  }

  await prisma.language.delete({ where: { id: req.params.id } })
  await logAction({
    ...actorContext(req), action: 'language.delete',
    targetType: 'language', targetId: req.params.id,
  })
  res.json({ ok: true })
}

router.get('/', list)
router.post('/', validateBody(createSchema), create)
router.patch('/:id', validateBody(updateSchema), update)
router.delete('/:id', remove)

export default router
