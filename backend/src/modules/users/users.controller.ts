import { RequestHandler } from 'express'
import { z } from 'zod'
import * as service from './users.service'

export const me: RequestHandler = async (req, res) => {
  const data = await service.getMe(req.userId!)
  res.json(data)
}

const languagesSchema = z.object({
  interfaceLanguage: z.string().min(2).max(5),
  targetLanguage: z.string().min(2).max(5),
})

export const updateLanguages: RequestHandler = async (req, res) => {
  const body = languagesSchema.parse(req.body)
  const data = await service.updateLanguages(
    req.userId!,
    body.interfaceLanguage,
    body.targetLanguage,
  )
  res.json(data)
}

export const getProfile: RequestHandler = async (req, res) => {
  const data = await service.getPublicProfile(req.userId!, req.params.username)
  res.json(data)
}
