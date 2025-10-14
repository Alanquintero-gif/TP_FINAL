import { Router } from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { listMessages, sendMessage, deleteMessage } from '../controllers/messages.controller.js'

const router = Router()
router.use(authMiddleware)
router.get('/:id', listMessages)     // conversationId
router.post('/:id', sendMessage)     // conversationId
router.delete('/:id', deleteMessage) // messageId
export default router
