import { Router } from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { listMessages, sendMessage, deleteMessage, updateMessage } from '../controllers/messages.controller.js'

const router = Router()
router.use(authMiddleware)
router.get('/:id', listMessages)     // conversationId
router.post('/:id', sendMessage)     // conversationId
router.delete('/:id', deleteMessage) // messageId
router.put('/:id', updateMessage);

export default router
