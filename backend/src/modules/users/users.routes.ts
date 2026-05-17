import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as controller from './users.controller'

const router = Router()

router.get('/:username', requireAuth, controller.getProfile)

export default router
