import { Router } from 'express'
import { requireAuth } from '../../../middleware/auth'
import { requireAdmin } from '../../../middleware/requireAdmin'
import { validateBody } from '../../../middleware/validate'
import { changeRoleSchema, suspendSchema } from './admin-users.schemas'
import * as controller from './admin-users.controller'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/', controller.list)
router.get('/:id', controller.get)
router.patch('/:id/role', validateBody(changeRoleSchema), controller.changeRole)
router.post('/:id/suspend', validateBody(suspendSchema), controller.suspend)
router.post('/:id/unsuspend', controller.unsuspend)
router.delete('/:id', controller.remove)

export default router
