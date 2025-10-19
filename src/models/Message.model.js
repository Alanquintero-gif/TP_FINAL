// Ejemplo de schema (ajustá nombres si difieren)
import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId:      { type: Schema.Types.ObjectId, ref: 'Users', required: true }, // 👈 quien envía
  text:          { type: String, required: true },
}, { timestamps: true });

export default model('Message', MessageSchema);

