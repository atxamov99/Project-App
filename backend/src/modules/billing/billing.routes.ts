import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as controller from './billing.controller'

const router = Router()

router.get('/plans', controller.plans)
router.post('/subscribe', requireAuth, controller.subscribe)
router.post('/cancel', requireAuth, controller.cancel)

export default router
