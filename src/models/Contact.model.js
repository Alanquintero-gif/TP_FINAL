import { Schema, model, Types } from 'mongoose'

const ContactSchema = new Schema({
  ownerUserId: { type: Types.ObjectId, ref: 'User', required: true }, // dueño de la agenda
  name:        { type: String, required: true },
  avatar:      { type: String, default: '' },
  lastSeen:    { type: Date, default: null },
}, { timestamps: true })

export default model('Contact', ContactSchema)
