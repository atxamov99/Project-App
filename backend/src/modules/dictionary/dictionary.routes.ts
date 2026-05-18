import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import * as controller from './dictionary.controller'

const router = Router()

router.get('/languages', controller.languages)
router.get('/translate', requireAuth, controller.translate)

export default router
