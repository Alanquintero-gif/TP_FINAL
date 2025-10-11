import { Schema, model, Types } from 'mongoose'

const MessageSchema = new Schema({
  conversationId: { type: Types.ObjectId, ref: 'Conversation', required: true },
  senderId:       { type: Types.ObjectId, ref: 'User', required: true },
  text:           { type: String, required: true },
  status:         { type: String, enum: ['no-recibido','no-visto','visto'], default: 'no-visto' },
  deletedAt:      { type: Date, default: null }, // soft delete
}, { timestamps: true })

export default model('Message', MessageSchema)
