import { Router, RequestHandler } from 'express'
import { z } from 'zod'
import { requireAuth } from '../../middleware/auth'
import { validateBody } from '../../middleware/validate'
import * as service from './friends.service'

const router = Router()
router.use(requireAuth)

const followSchema = z.object({
  username: z.string().min(1).max(30),
})

const following: RequestHandler = async (req, res) => {
  const items = await service.listFollowing(req.userId!)
  res.json({ items })
}

const followers: RequestHandler = async (req, res) => {
  const items = await service.listFollowers(req.userId!)
  res.json({ items })
}

const follow: RequestHandler = async (req, res) => {
  const user = await service.followUser(req.userId!, req.body.username)
  res.status(201).json({ user })
}

const unfollow: RequestHandler = async (req, res) => {
  const result = await service.unfollowUser(req.userId!, req.params.userId)
  res.json(result)
}

const search: RequestHandler = async (req, res) => {
  const q = String(req.query.q ?? '').trim()
  const items = await service.searchUsers(req.userId!, q)
  res.json({ items })
}

router.get('/following', following)
router.get('/followers', followers)
router.post('/follow', validateBody(followSchema), follow)
router.delete('/unfollow/:userId', unfollow)
router.get('/search', search)

export default router
