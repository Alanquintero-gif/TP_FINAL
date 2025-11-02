// controllers/messages.controller.js
import Message from '../models/Message.model.js';
import Conversation from '../models/Conversation.model.js';

// DTO helper: agrega fromMe en base al usuario autenticado
function toDTO(msg, meId) {
  return {
    _id: msg._id,
    text: msg.text,
    createdAt: msg.createdAt,
    senderId: msg.senderId,
    conversationId: msg.conversationId,
    fromMe: String(msg.senderId) === String(meId), // 👈 clave para el front
  };
}

// GET /api/messages/:conversationId
export async function listMessages(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: conversationId } = req.params;

    // validar que el usuario participe de la conversación
    const conv = await Conversation.findById(conversationId);
    if (!conv) {
      return res
        .status(404)
        .json({ ok: false, message: 'Conversation not found' });
    }

    if (!conv.participants.some(p => String(p) === String(userId))) {
      return res
        .status(403)
        .json({ ok: false, message: 'Forbidden' });
    }

    const items = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    const data = items.map(m => toDTO(m, userId));
    return res.json({ ok: true, data });
  } catch (e) {
    console.error('[messages:list]', e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
}

// POST /api/messages/:conversationId
export async function sendMessage(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: conversationId } = req.params;
    const { text } = req.body || {};

    if (!text?.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: 'Texto requerido' });
    }

    // validar participante
    const conv = await Conversation.findById(conversationId);
    if (!conv) {
      return res
        .status(404)
        .json({ ok: false, message: 'Conversation not found' });
    }

    if (!conv.participants.some(p => String(p) === String(userId))) {
      return res
        .status(403)
        .json({ ok: false, message: 'Forbidden' });
    }

    const created = await Message.create({
      conversationId,
      senderId: userId, // 👈 coincide con tu schema real
      text: text.trim(),
    });

    // actualizar "último mensaje" en la conversación (opcional pero bueno)
    conv.lastMessage = {
      lastText: text.trim(),
      createdAt: created.createdAt,
    };
    conv.lastMessageAt = created.createdAt;
    await conv.save();

    return res.json({ ok: true, data: toDTO(created, userId) });
  } catch (e) {
    console.error('[messages:send]', e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
}

// PUT /api/messages/:messageId
// body: { text }
export async function updateMessage(req, res) {
  try {
    const { id: userId } = req.user;        // viene del authMiddleware
    const { id: messageId } = req.params;   // mensaje a editar
    const { text } = req.body || {};

    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: 'El texto no puede estar vacío' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ ok: false, message: 'Mensaje no encontrado' });
    }

    // sólo el autor puede editar
    if (String(message.senderId) !== String(userId)) {
      return res
        .status(403)
        .json({ ok: false, message: 'No puedes editar un mensaje que no es tuyo' });
    }

    // actualizar el texto y guardar
    message.text = text.trim();
    await message.save();

    // devolvemos el mensaje actualizado en el mismo formato DTO
    return res.json({
      ok: true,
      data: toDTO(message, userId),
    });
  } catch (error) {
    console.error('[messages:update]', error);
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' });
  }
}

// DELETE /api/messages/:messageId
export async function deleteMessage(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: messageId } = req.params;

    const msg = await Message.findById(messageId);
    if (!msg) {
      return res
        .status(404)
        .json({ ok: false, message: 'Message not found' });
    }

    // sólo autor puede borrar
    if (String(msg.senderId) !== String(userId)) {
      return res
        .status(403)
        .json({ ok: false, message: 'Forbidden' });
    }

    await msg.deleteOne();
    return res.json({ ok: true });
  } catch (e) {
    console.error('[messages:delete]', e);
    return res
      .status(500)
      .json({ ok: false, message: 'Server error' });
  }
}
