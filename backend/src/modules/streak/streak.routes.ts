import { Router, RequestHandler } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as service from './streak.service'

const router = Router()

const get: RequestHandler = async (req, res) => {
  const data = await service.getStreak(req.userId!)
  res.json(data)
}

const buyFreeze: RequestHandler = async (req, res) => {
  const data = await service.buyStreakFreeze(req.userId!)
  res.json(data)
}

router.get('/', requireAuth, get)
router.post('/freeze', requireAuth, buyFreeze)

export default router
