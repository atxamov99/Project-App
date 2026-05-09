import { Router, RequestHandler } from 'express'
import { requireAuth } from '../../../middleware/auth'
import { requireAdmin } from '../../../middleware/requireAdmin'
import * as service from './stats.service'

const router = Router()
router.use(requireAuth, requireAdmin)

const dashboard: RequestHandler = async (_req, res) => {
  const data = await service.getDashboard()
  res.json(data)
}

const troubled: RequestHandler = async (req, res) => {
  const limit = Math.min(50, Number(req.query.limit) || 20)
  const items = await service.getTroubledExercises(limit)
  res.json({ items })
}

router.get('/dashboard', dashboard)
router.get('/exercises/troubled', troubled)

export default router
