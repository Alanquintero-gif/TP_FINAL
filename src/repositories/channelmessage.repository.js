import ChannelMessage from "../models/Channel_Message.model.js";


class ChannelMessageRepository {
    // Crear un nuevo mensaje
    static async createMessage(channel_id, member_id, content) {
        await ChannelMessage.create({
            channel: channel_id,
            member: member_id,
            content: content
        })
        return true
    }

    // Obtener todos los mensajes
    static async getAll() {
        const messages = await ChannelMessage.find()
            .populate("channel")
            .populate("member")
        return messages
    }

    // Obtener un mensaje por ID
    static async getById(message_id) {
        const message = await ChannelMessage.findById(message_id)
            .populate("channel")
            .populate("member")
        return message
    }

    // Eliminar un mensaje por ID
    static async deleteById(message_id) {
        await ChannelMessage.findByIdAndDelete(message_id)
        return true
    }

    // Actualizar un mensaje por ID
    static async updateById(message_id, new_values) {
        const message_updated = await ChannelMessage.findByIdAndUpdate(
            message_id,
            new_values,
            { new: true }
        )
            .populate("channel")
            .populate("member")
        return message_updated
    }}

    export default ChannelMessageRepository