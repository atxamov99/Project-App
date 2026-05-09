import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { validateBody } from '../../middleware/validate'
import { completeLessonSchema } from './lessons.schemas'
import * as controller from './lessons.controller'

const router = Router()

router.get('/:id', requireAuth, controller.get)
router.post('/:id/complete', requireAuth, validateBody(completeLessonSchema), controller.complete)

export default router
