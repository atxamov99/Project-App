import { RequestHandler } from 'express'
import * as service from './practice.service'

export const session: RequestHandler = async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined
  const data = await service.getPracticeSession(req.userId!, limit)
  res.json(data)
}
