import Contact from '../models/Contact.model.js'
import currentUserId from '../utils/currentUserId.js'

export async function listContacts(req, res) {
  try {
    const ownerUserId = req.user.id;
    const contacts = await Contact.find({ ownerUserId }).sort({ createdAt: -1 });
    res.json({ ok: true, data: contacts });
  } catch (e) {
    console.error("[contacts:list]", e);
    res.status(500).json({ ok: false, message: "Server error" });
  }
}

export async function createContact(req, res) {
  try {
    const ownerUserId = req.user.id;
    const { name, avatar } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ ok: false, message: "Nombre requerido" });

    const created = await Contact.create({ ownerUserId, name: name.trim(), avatar: avatar || "" });
    res.json({ ok: true, data: created });
  } catch (e) {
    console.error("[contacts:create]", e);
    res.status(500).json({ ok: false, message: "Server error" });
  }
}

export async function deleteContact(req, res) {
  try {
    const ownerUserId = req.user.id;
    const { id } = req.params;
    const doc = await Contact.findOneAndDelete({ _id: id, ownerUserId });
    if (!doc) return res.status(404).json({ ok: false, message: "No encontrado" });
    res.json({ ok: true });
  } catch (e) {
    console.error("[contacts:delete]", e);
    res.status(500).json({ ok: false, message: "Server error" });
  }
}