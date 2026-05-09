import { Router } from 'express'
import { validateBody } from '../../middleware/validate'
import { requireAuth } from '../../middleware/auth'
import { googleLoginSchema, loginSchema, registerSchema } from './auth.schemas'
import * as controller from './auth.controller'

const router = Router()

router.post('/register', validateBody(registerSchema), controller.register)
router.post('/login', validateBody(loginSchema), controller.login)
router.post('/google', validateBody(googleLoginSchema), controller.googleLogin)
router.post('/logout', requireAuth, controller.logout)
router.get('/me', requireAuth, controller.me)

export default router
