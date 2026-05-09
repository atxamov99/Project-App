import { RequestHandler } from 'express'
import * as service from './exercises.service'

export const check: RequestHandler = async (req, res) => {
  const result = await service.checkAnswer(req.userId!, req.params.id, req.body.answer)
  res.json(result)
}
