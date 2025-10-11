import { Schema, model, Types } from 'mongoose'

const ConversationSchema = new Schema({
  participants:   [{ type: Types.ObjectId, ref: 'User', required: true }], // 1:1 (o grupos si luego querés)
  isGroup:        { type: Boolean, default: false },
  lastMessageAt:  { type: Date, default: null },
}, { timestamps: true })

export default model('Conversation', ConversationSchema)
