import Conversation from '../models/Conversation.model.js'
import currentUserId from '../utils/currentUserId.js'

export const listMyConversations = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const convs = await Conversation
      .find({ participants: userId })
      .sort({ lastMessageAt: -1 })
    res.json(convs)
  } catch (err) { next(err) }
}

export const openConversation = async (req, res, next) => {
  try {
    const userId = currentUserId(req)
    const { participantId } = req.body
    let conv = await Conversation.findOne({
      participants: { $all: [userId, participantId], $size: 2 }
    })
    if (!conv) {
      conv = await Conversation.create({
        participants: [userId, participantId],
        isGroup: false
      })
    }
    res.status(201).json(conv)
  } catch (err) { next(err) }
}
