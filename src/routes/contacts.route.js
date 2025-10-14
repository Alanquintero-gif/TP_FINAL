import { Router } from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { listContacts, createContact, deleteContact } from '../controllers/contacts.controller.js'

const router = Router()
router.use(authMiddleware)
router.get('/', listContacts)
router.post('/', createContact)
router.delete('/:id', deleteContact)
export default router
