import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorHandler, notFound } from './middleware/error'
import { authLimiter, generalLimiter } from './middleware/rateLimit'
import authRoutes from './modules/auth/auth.routes'
import coursesRoutes from './modules/courses/courses.routes'
import lessonsRoutes from './modules/lessons/lessons.routes'
import exercisesRoutes from './modules/exercises/exercises.routes'
import streakRoutes from './modules/streak/streak.routes'
import livesRoutes from './modules/lives/lives.routes'
import leagueRoutes from './modules/league/league.routes'
import wordsRoutes from './modules/words/words.routes'
import friendsRoutes from './modules/friends/friends.routes'
import practiceRoutes from './modules/practice/practice.routes'
import usersRoutes from './modules/users/users.routes'
import billingRoutes from './modules/billing/billing.routes'
import dictionaryRoutes from './modules/dictionary/dictionary.routes'
import adminUsersRoutes from './modules/admin/users/admin-users.routes'
import adminLanguagesRoutes from './modules/admin/content/languages.routes'
import adminCoursesRoutes from './modules/admin/content/courses.routes'
import adminUnitsRoutes from './modules/admin/content/units.routes'
import adminLessonsRoutes from './modules/admin/content/lessons.routes'
import adminExercisesRoutes from './modules/admin/content/exercises.routes'
import adminWordsRoutes from './modules/admin/content/words.routes'
import adminAchievementsRoutes from './modules/admin/content/achievements.routes'
import adminStatsRoutes from './modules/admin/stats/stats.routes'
import aiRoutes from './modules/ai/ai.routes'

export function createApp() {
  const app = express()

  app.use(helmet({
    crossOriginOpenerPolicy: {
      policy: 'same-origin-allow-popups',
    },
  }))
  const allowedOrigins = env.CORS_ORIGIN === '*'
    ? true
    : env.CORS_ORIGIN.split(',').map((o) => o.trim())
  app.use(cors({ origin: allowedOrigins, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'))

  app.get('/health', (_req, res) => res.json({ ok: true, env: env.NODE_ENV }))

  // Rate limit barcha /api/* uchun, auth uchun qattiqroq
  app.use('/api', generalLimiter)
  app.use('/api/auth/login', authLimiter)
  app.use('/api/auth/register', authLimiter)
  app.use('/api/auth/google', authLimiter)

  app.use('/api/auth', authRoutes)
  app.use('/api/courses', coursesRoutes)
  app.use('/api/lessons', lessonsRoutes)
  app.use('/api/exercises', exercisesRoutes)
  app.use('/api/streak', streakRoutes)
  app.use('/api/lives', livesRoutes)
  app.use('/api/league', leagueRoutes)
  app.use('/api/words', wordsRoutes)
  app.use('/api/friends', friendsRoutes)
  app.use('/api/practice', practiceRoutes)
  app.use('/api/users', usersRoutes)
  app.use('/api/billing', billingRoutes)
  app.use('/api/dictionary', dictionaryRoutes)
  app.use('/api/ai', aiRoutes)
  app.use('/api/admin/users', adminUsersRoutes)
  app.use('/api/admin/languages', adminLanguagesRoutes)
  app.use('/api/admin/courses', adminCoursesRoutes)
  app.use('/api/admin/units', adminUnitsRoutes)
  app.use('/api/admin/lessons', adminLessonsRoutes)
  app.use('/api/admin/exercises', adminExercisesRoutes)
  app.use('/api/admin/words', adminWordsRoutes)
  app.use('/api/admin/achievements', adminAchievementsRoutes)
  app.use('/api/admin/stats', adminStatsRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
