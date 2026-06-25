import { Router, type Router as RouterType } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { redirectToGoogle, googleCallback, logout, me } from './auth.controller.js'

const router: RouterType = Router()

router.get('/google', redirectToGoogle)
router.get('/google/callback', googleCallback)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router
