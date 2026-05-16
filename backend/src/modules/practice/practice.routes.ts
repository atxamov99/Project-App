import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as controller from './practice.controller'

const router = Router()

router.get('/session', requireAuth, controller.session)

export default router
