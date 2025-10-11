import Contact from '../models/Contact.model.js'
import currentUserId from '../utils/currentUserId.js'

export const listContacts = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const items = await Contact.find({ ownerUserId: userId }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) { next(err) }
}

export const createContact = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const { name, avatar } = req.body
    const created = await Contact.create({ ownerUserId: userId, name, avatar })
    res.status(201).json(created)
  } catch (err) { next(err) }
}

export const deleteContact = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const { id } = req.params
    await Contact.deleteOne({ _id: id, ownerUserId: userId })
    res.status(204).end()
  } catch (err) { next(err) }
}
