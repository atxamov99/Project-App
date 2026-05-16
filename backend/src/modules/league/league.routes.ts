import { Router, RequestHandler } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as service from './league.service'

const router = Router()

const get: RequestHandler = async (req, res) => {
  const data = await service.getLeague(req.userId!)
  res.json(data)
}

router.get('/', requireAuth, get)

export default router
