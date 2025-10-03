import Channel from "../models/channel.model.js";


class ChannelRepository {
    static async createChannel(name, workspace_id, isPrivate = false) {
        await Channel.create({
            name: name,
            workspace: workspace_id,
            private: isPrivate
        })
        return true
    }

    static async getAll() {
        const channels = await Channel.find()
            .populate("workspace")
        return channels
    }

    static async getById(channel_id) {
        const channel = await Channel.findById(channel_id)
            .populate("workspace")
        return channel
    }

    static async deleteById(channel_id) {
        await Channel.findByIdAndDelete(channel_id)
        return true
    }

    static async updateById(channel_id, new_values) {
        new_values.modified_at = new Date()  // actualizar la fecha de modificación
        const channel_updated = await Channel.findByIdAndUpdate(
            channel_id,
            new_values,
            { new: true }
        ).populate("workspace")
        return channel_updated
    }
}
export default ChannelRepository
