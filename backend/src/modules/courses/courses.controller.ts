import { RequestHandler } from 'express'
import * as service from './courses.service'

export const list: RequestHandler = async (_req, res) => {
  const courses = await service.listCourses()
  res.json({ courses })
}

export const current: RequestHandler = async (req, res) => {
  const data = await service.getCurrentCourse(req.userId!)
  res.json(data)
}

export const get: RequestHandler = async (req, res) => {
  const data = await service.getCourse(req.params.id, req.userId)
  res.json(data)
}

export const enroll: RequestHandler = async (req, res) => {
  const result = await service.enrollInCourse(req.userId!, req.params.id)
  res.status(201).json(result)
}
