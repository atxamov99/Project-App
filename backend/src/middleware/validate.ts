import { RequestHandler } from 'express'
import { ZodSchema } from 'zod'

export const validateBody =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    req.body = schema.parse(req.body)
    next()
  }
