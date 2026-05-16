import { RequestHandler } from 'express'
import * as service from './lessons.service'

export const get: RequestHandler = async (req, res) => {
  const lesson = await service.getLesson(req.params.id)
  res.json({ lesson })
}

export const complete: RequestHandler = async (req, res) => {
  const result = await service.completeLesson(req.userId!, req.params.id, req.body)
  res.json(result)
}
