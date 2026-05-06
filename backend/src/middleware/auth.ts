import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Avtorizatsiya talab etiladi' })
  }

  try {
    const token = header.slice('Bearer '.length).trim()
    const payload = verifyToken(token)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Yaroqsiz yoki muddati o\'tgan token' })
  }
}
