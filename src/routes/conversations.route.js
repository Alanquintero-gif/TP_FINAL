import { Router } from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { listMyConversations, openConversation } from '../controllers/conversations.controller.js'

const router = Router()
router.use(authMiddleware)
router.get('/', listMyConversations)
router.post('/', openConversation)
export default router
