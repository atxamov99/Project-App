import { RequestHandler } from 'express'
import * as service from './dictionary.service'

export const translate: RequestHandler = async (req, res) => {
  const q = (req.query.q as string) || ''
  const from = (req.query.from as string) || 'uz'
  const to = (req.query.to as string) || 'en'
  const result = await service.translate(q, from, to)
  res.json(result)
}

export const languages: RequestHandler = (_req, res) => {
  res.json({ languages: service.listSupportedLanguages() })
}
