import Conversation from '../models/Conversation.model.js'
import Message from '../models/Message.model.js'
import currentUserId from '../utils/currentUserId.js'

export const listMessages = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const { id } = req.params // conversationId
    const conv = await Conversation.findById(id)
    if (!conv || !conv.participants.map(String).includes(String(userId))) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const msgs = await Message.find({ conversationId: id, deletedAt: null }).sort({ createdAt: 1 })
    res.json(msgs)
  } catch (err) { next(err) }
}

export const sendMessage = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const { id } = req.params // conversationId
    const { text } = req.body

    const conv = await Conversation.findById(id)
    if (!conv || !conv.participants.map(String).includes(String(userId))) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const msg = await Message.create({
      conversationId: id,
      senderId: userId,
      text,
      status: 'no-visto'
    })
    await Conversation.findByIdAndUpdate(id, { lastMessageAt: new Date() })
    res.status(201).json(msg)
  } catch (err) { next(err) }
}

export const deleteMessage = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const { id } = req.params // messageId
    const msg = await Message.findById(id)
    if (!msg) return res.status(404).json({ message: 'Not found' })
    if (String(msg.senderId) !== String(userId)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    msg.deletedAt = new Date()
    await msg.save()
    res.status(204).end()
  } catch (err) { next(err) }
}
