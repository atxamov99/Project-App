import { RequestHandler } from 'express'
import * as service from './billing.service'

export const plans: RequestHandler = (_req, res) => {
  res.json({ plans: service.listPlans() })
}

export const subscribe: RequestHandler = async (req, res) => {
  const { plan } = req.body
  if (plan !== 'PLUS' && plan !== 'MAX') {
    res.status(400).json({ error: "Noto'g'ri tarif" })
    return
  }
  const data = await service.subscribe(req.userId!, plan)
  res.json(data)
}

export const cancel: RequestHandler = async (req, res) => {
  const data = await service.cancel(req.userId!)
  res.json(data)
}
