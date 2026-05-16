import { RequestHandler } from 'express'
import * as service from './auth.service'

export const register: RequestHandler = async (req, res) => {
  const result = await service.register(req.body)
  res.status(201).json(result)
}

export const login: RequestHandler = async (req, res) => {
  const result = await service.login(req.body)
  res.json(result)
}

export const googleLogin: RequestHandler = async (req, res) => {
  const result = await service.googleLogin(req.body)
  res.json(result)
}

export const me: RequestHandler = async (req, res) => {
  const user = await service.me(req.userId!)
  res.json({ user })
}

export const logout: RequestHandler = (_req, res) => {
  // Stateless JWT — frontend tokenni o'chirsa kifoya. Session jadvali ishlatilsa, bu yerda o'chiriladi.
  res.status(204).send()
}
