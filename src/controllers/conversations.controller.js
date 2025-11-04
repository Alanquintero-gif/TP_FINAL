import Conversation from '../models/Conversation.model.js';
import Message from '../models/Message.model.js';
import defaultGreetings from '../config/defaultGreetings.js';


function toDTO(conv) {
  return {
    _id: conv._id,
    participants: conv.participants?.map(String) || [],
    isGroup: !!conv.isGroup,
    lastMessageAt: conv.lastMessageAt || null,
    lastMessage: conv.lastMessage
      ? {
          lastText: conv.lastMessage.lastText || '',
          createdAt: conv.lastMessage.createdAt || conv.lastMessageAt || null,
        }
      : null,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
  };
}


export async function listMyConversations(req, res) {
  try {
    const { id: meId } = req.user;

    const items = await Conversation.find({
      participants: { $in: [meId] },
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    const withFallback = await Promise.all(
      items.map(async (c) => {
        if (!c.lastMessage) {
          const last = await Message.findOne({ conversationId: c._id })
            .sort({ createdAt: -1 })
            .lean();
          if (last) {
            c.lastMessage = { lastText: last.text, createdAt: last.createdAt };
            c.lastMessageAt = last.createdAt;
          }
        }
        return c;
      })
    );

    const data = withFallback.map(toDTO);
    res.json({ ok: true, data });
  } catch (e) {
    console.error('[conversations:listMyConversations]', e);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
}


export async function openConversation(req, res) {
  try {
    const { id: meId } = req.user;
    const { participantId } = req.body || {};

    if (!participantId) {
      return res.status(400).json({ ok: false, message: 'participantId requerido' });
    }
    if (String(participantId) === String(meId)) {
      return res.status(400).json({ ok: false, message: 'No podés abrir chat con vos mismo' });
    }

    let conv = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [meId, participantId], $size: 2 },
    });

    if (!conv) {
      conv = await Conversation.create({
        participants: [meId, participantId],
        isGroup: false,
        lastMessageAt: null,
        lastMessage: null,
      });

      const greet = defaultGreetings[String(participantId)];
      if (greet && greet.trim()) {
        const created = await Message.create({
          conversationId: conv._id,
          senderId: participantId, // ← lo "envía" el contacto
          text: greet.trim(),
        });

        conv.lastMessage = { lastText: greet.trim(), createdAt: created.createdAt };
        conv.lastMessageAt = created.createdAt;
        await conv.save();
      }
    }

    res.json({ ok: true, data: toDTO(conv) });
  } catch (e) {
    console.error('[conversations:openConversation]', e);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
}
