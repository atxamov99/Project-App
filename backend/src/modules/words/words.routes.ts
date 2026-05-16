import { Router, RequestHandler } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../middleware/auth'
import { validateBody } from '../../middleware/validate'
import * as service from './words.service'

const router = Router()

const dueReview: RequestHandler = async (req, res) => {
  const limit = Math.min(50, Number(req.query.limit) || 20)
  const items = await service.dueForReview(req.userId!, limit)
  res.json({ items })
}

const reviewedSchema = z.object({ correct: z.boolean() })

const reviewed: RequestHandler = async (req, res) => {
  const result = await service.reviewedWord(req.userId!, req.params.id, req.body.correct)
  res.json(result)
}

router.get('/review', requireAuth, dueReview)
router.post('/:id/reviewed', requireAuth, validateBody(reviewedSchema), reviewed)

export default router
