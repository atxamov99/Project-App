import { RequestHandler } from 'express'
import { listUsersQuerySchema } from './admin-users.schemas'
import * as service from './admin-users.service'
import { actorContext, logAction } from '../audit/audit.service'

export const list: RequestHandler = async (req, res) => {
  const q = listUsersQuerySchema.parse(req.query)
  const result = await service.listUsers(q)
  res.json(result)
}

export const get: RequestHandler = async (req, res) => {
  const user = await service.getUser(req.params.id)
  res.json({ user })
}

export const changeRole: RequestHandler = async (req, res) => {
  const { user, before, after } = await service.changeRole(req.userId!, req.params.id, req.body.role)
  await logAction({
    ...actorContext(req),
    action: 'user.role.change',
    targetType: 'user',
    targetId: req.params.id,
    metadata: { before, after },
  })
  res.json({ user })
}

export const suspend: RequestHandler = async (req, res) => {
  const user = await service.suspendUser(req.userId!, req.params.id, req.body.reason)
  await logAction({
    ...actorContext(req),
    action: 'user.suspend',
    targetType: 'user',
    targetId: req.params.id,
    metadata: { reason: req.body.reason },
  })
  res.json({ user })
}

export const unsuspend: RequestHandler = async (req, res) => {
  const user = await service.unsuspendUser(req.params.id)
  await logAction({
    ...actorContext(req),
    action: 'user.unsuspend',
    targetType: 'user',
    targetId: req.params.id,
  })
  res.json({ user })
}

export const remove: RequestHandler = async (req, res) => {
  const result = await service.deleteUser(req.userId!, req.params.id)
  await logAction({
    ...actorContext(req),
    action: 'user.delete',
    targetType: 'user',
    targetId: req.params.id,
  })
  res.json(result)
}
