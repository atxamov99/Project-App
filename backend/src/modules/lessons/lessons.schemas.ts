import { z } from 'zod'

export const completeLessonSchema = z.object({
  mistakes: z.coerce.number().int().min(0).max(100).optional(),
  timeTaken: z.coerce.number().int().min(0).max(36_000).optional(),
})

export const checkAnswerSchema = z.object({
  answer: z.string().min(1, 'Javob bo\'sh bo\'lmasin').max(500),
})

export type CompleteLessonInput = z.infer<typeof completeLessonSchema>
export type CheckAnswerInput = z.infer<typeof checkAnswerSchema>
