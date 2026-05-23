import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as controller from './users.controller'

const router = Router()

// IMPORTANT: static routes must come before the dynamic ":username" matcher
// or "me" gets captured as a username.
router.get('/me', requireAuth, controller.me)
router.patch('/me/languages', requireAuth, controller.updateLanguages)
router.get('/:username', requireAuth, controller.getProfile)

export default router
