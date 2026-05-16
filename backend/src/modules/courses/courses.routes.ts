import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as controller from './courses.controller'

const router = Router()

router.get('/', controller.list)
router.get('/:id', requireAuth, controller.get)
router.post('/:id/enroll', requireAuth, controller.enroll)

export default router
