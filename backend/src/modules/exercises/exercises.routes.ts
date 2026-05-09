import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { validateBody } from '../../middleware/validate'
import { checkAnswerSchema } from '../lessons/lessons.schemas'
import * as controller from './exercises.controller'

const router = Router()

router.post('/:id/check', requireAuth, validateBody(checkAnswerSchema), controller.check)

export default router
