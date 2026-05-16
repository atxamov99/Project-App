import { Router, RequestHandler } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../../middleware/auth'
import { requireContentEditor } from '../../../middleware/requireContentEditor'
import { validateBody } from '../../../middleware/validate'
import { prisma } from '../../../config/db'
import { actorContext, logAction } from '../audit/audit.service'

const router = Router()
router.use(requireAuth, requireContentEditor)

const exerciseTypeEnum = z.enum([
  'TRANSLATE_TEXT', 'BUILD_SENTENCE', 'LISTEN_AND_TYPE', 'SPEAK_AND_CHECK',
  'MATCH_PAIRS', 'SELECT_IMAGE', 'FILL_IN_BLANK', 'MULTIPLE_CHOICE',
])

const createSchema = z.object({
  type: exerciseTypeEnum,
  question: z.string().min(1).max(500),
  questionAudio: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  questionImage: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  correctAnswer: z.string().min(1).max(500),
  wrongAnswers: z.array(z.string()).max(10).default([]),
  explanation: z.string().max(1000).optional(),
  difficulty: z.coerce.number().int().min(1).max(5).default(1),
  targetLangCode: z.string().min(2).max(5),
  lessonId: z.string().optional(),  // agar berilsa, mashqni darsga ulaydi
  order: z.coerce.number().int().min(1).optional(),
})

const updateSchema = createSchema.partial().omit({ lessonId: true, order: true })

const attachSchema = z.object({
  exerciseId: z.string().min(1),
  order: z.coerce.number().int().min(1),
})

const listByLesson: RequestHandler = async (req, res) => {
  const items = await prisma.lessonExercise.findMany({
    where: { lessonId: req.params.lessonId },
    orderBy: { order: 'asc' },
    include: { exercise: true },
  })
  res.json({
    exercises: items.map((it) => ({
      ...it.exercise,
      lessonExerciseId: it.id,
      order: it.order,
    })),
  })
}

const create: RequestHandler = async (req, res) => {
  const { lessonId, order, ...rest } = req.body

  const exercise = await prisma.exercise.create({ data: rest })

  if (lessonId) {
    await prisma.lessonExercise.create({
      data: { lessonId, exerciseId: exercise.id, order: order ?? 1 },
    })
  }

  await logAction({
    ...actorContext(req), action: 'exercise.create',
    targetType: 'exercise', targetId: exercise.id, metadata: rest,
  })
  res.status(201).json({ exercise })
}

const update: RequestHandler = async (req, res) => {
  const exercise = await prisma.exercise.update({ where: { id: req.params.id }, data: req.body })
  await logAction({
    ...actorContext(req), action: 'exercise.update',
    targetType: 'exercise', targetId: exercise.id, metadata: req.body,
  })
  res.json({ exercise })
}

const remove: RequestHandler = async (req, res) => {
  await prisma.exercise.delete({ where: { id: req.params.id } })
  await logAction({
    ...actorContext(req), action: 'exercise.delete',
    targetType: 'exercise', targetId: req.params.id,
  })
  res.json({ ok: true })
}

const attach: RequestHandler = async (req, res) => {
  const item = await prisma.lessonExercise.create({
    data: { lessonId: req.params.lessonId, ...req.body },
  })
  await logAction({
    ...actorContext(req), action: 'exercise.attach',
    targetType: 'lesson', targetId: req.params.lessonId, metadata: req.body,
  })
  res.status(201).json({ item })
}

const detach: RequestHandler = async (req, res) => {
  await prisma.lessonExercise.delete({ where: { id: req.params.linkId } })
  await logAction({
    ...actorContext(req), action: 'exercise.detach',
    targetType: 'lessonExercise', targetId: req.params.linkId,
  })
  res.json({ ok: true })
}

router.get('/by-lesson/:lessonId', listByLesson)
router.post('/', validateBody(createSchema), create)
router.patch('/:id', validateBody(updateSchema), update)
router.delete('/:id', remove)
router.post('/attach/:lessonId', validateBody(attachSchema), attach)
router.delete('/link/:linkId', detach)

export default router
