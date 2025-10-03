import mongoose from "mongoose";
import { Schema } from "mongoose";


const channelmessageSchema = new mongoose.Schema (
    {
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }
)

const ChannelMessage = mongoose.model ('ChannelMessage', channelmessageSchema)
export default ChannelMessage