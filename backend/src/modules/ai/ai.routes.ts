import { Router, RequestHandler } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../middleware/auth'
import { validateBody } from '../../middleware/validate'
import * as service from './ai.service'

const router = Router()

const langSchema = z.enum(['en', 'ru', 'uz'])
const levelSchema = z.enum(['beginner', 'intermediate', 'advanced']).optional()

const translateSchema = z.object({
  text: z.string().min(1).max(2000),
  from: z.union([langSchema, z.literal('auto')]),
  to: langSchema,
})
const translate: RequestHandler = async (req, res) => {
  const { text, from, to } = req.body
  const result = await service.translateText(text, from, to)
  res.json(result)
}

const explainSchema = z.object({
  exerciseType: z.string().min(1).max(50),
  prompt: z.string().min(1).max(500),
  userAnswer: z.string().max(500),
  correctAnswer: z.string().min(1).max(500),
  learningLang: langSchema,
  interfaceLang: langSchema,
})
const explain: RequestHandler = async (req, res) => {
  const result = await service.explainAnswer(req.body)
  res.json(result)
}

const chatSchema = z.object({
  userMessage: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(1000),
      }),
    )
    .max(20)
    .default([]),
  learningLang: langSchema,
  interfaceLang: langSchema,
  level: levelSchema,
})
const chat: RequestHandler = async (req, res) => {
  const result = await service.chatReply(req.body)
  res.json(result)
}

const generateExerciseSchema = z.object({
  type: z.enum(['MultipleChoice', 'FillInBlank', 'TranslateText', 'ListenType', 'SelectImage', 'BuildSentence']),
  word: z.string().max(100).optional(),
  topic: z.string().max(100).optional(),
  learningLang: langSchema,
  interfaceLang: langSchema,
  level: levelSchema,
})
const generateExercise: RequestHandler = async (req, res) => {
  const result = await service.generateExercise(req.body)
  res.json(result)
}

router.post('/translate', requireAuth, validateBody(translateSchema), translate)
router.post('/explain', requireAuth, validateBody(explainSchema), explain)
router.post('/chat', requireAuth, validateBody(chatSchema), chat)
router.post('/generate-exercise', requireAuth, validateBody(generateExerciseSchema), generateExercise)

export default router
