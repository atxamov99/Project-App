import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorHandler, notFound } from './middleware/error'
import authRoutes from './modules/auth/auth.routes'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'))

  app.get('/health', (_req, res) => res.json({ ok: true, env: env.NODE_ENV }))

  app.use('/api/auth', authRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
