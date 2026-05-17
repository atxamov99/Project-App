import { RequestHandler } from 'express'
import * as service from './users.service'

export const getProfile: RequestHandler = async (req, res) => {
  const data = await service.getPublicProfile(req.userId!, req.params.username)
  res.json(data)
}
