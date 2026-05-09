import { Router, RequestHandler } from 'express'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { requireAuth } from '../../../middleware/auth'
import { requireContentEditor } from '../../../middleware/requireContentEditor'
import { validateBody } from '../../../middleware/validate'
import { prisma } from '../../../config/db'
import { actorContext, logAction } from '../audit/audit.service'

const router = Router()
router.use(requireAuth, requireContentEditor)

const createSchema = z.object({
  languageId: z.string().min(1),
  text: z.string().min(1).max(100),
  translation: z.string().min(1).max(200),
  pronunciation: z.string().max(100).optional(),
  audioUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  imageUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  category: z.string().min(1).max(50).default('General'),
  level: z.string().min(1).max(10).default('A1'),
})

const updateSchema = createSchema.partial()

const listQuerySchema = z.object({
  languageId: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

const list: RequestHandler = async (req, res) => {
  const q = listQuerySchema.parse(req.query)
  const where: Prisma.WordWhereInput = {}
  if (q.languageId) where.languageId = q.languageId
  if (q.category) where.category = q.category
  if (q.level) where.level = q.level
  if (q.search) {
    where.OR = [
      { text: { contains: q.search, mode: 'insensitive' } },
      { translation: { contains: q.search, mode: 'insensitive' } },
    ]
  }

  const [words, total] = await Promise.all([
    prisma.word.findMany({
      where,
      orderBy: { text: 'asc' },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: { language: true },
    }),
    prisma.word.count({ where }),
  ])

  res.json({ words, total, page: q.page, limit: q.limit })
}

const create: RequestHandler = async (req, res) => {
  const word = await prisma.word.create({ data: req.body })
  await logAction({
    ...actorContext(req), action: 'word.create',
    targetType: 'word', targetId: word.id, metadata: req.body,
  })
  res.status(201).json({ word })
}

const update: RequestHandler = async (req, res) => {
  const word = await prisma.word.update({ where: { id: req.params.id }, data: req.body })
  await logAction({
    ...actorContext(req), action: 'word.update',
    targetType: 'word', targetId: word.id, metadata: req.body,
  })
  res.json({ word })
}

const remove: RequestHandler = async (req, res) => {
  await prisma.word.delete({ where: { id: req.params.id } })
  await logAction({
    ...actorContext(req), action: 'word.delete',
    targetType: 'word', targetId: req.params.id,
  })
  res.json({ ok: true })
}

router.get('/', list)
router.post('/', validateBody(createSchema), create)
router.patch('/:id', validateBody(updateSchema), update)
router.delete('/:id', remove)

export default router
