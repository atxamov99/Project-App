import { Router, RequestHandler } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as service from './lives.service'

const router = Router()

const get: RequestHandler = async (req, res) => {
  const lives = await service.getLives(req.userId!)
  res.json(lives)
}

const buy: RequestHandler = async (req, res) => {
  const lives = await service.buyLives(req.userId!)
  res.json(lives)
}

router.get('/', requireAuth, get)
router.post('/buy', requireAuth, buy)

export default router
