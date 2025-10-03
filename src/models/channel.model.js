import mongoose from "mongoose";
import { Schema } from "mongoose";



const channelSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true
        },
        //claves foraneas//
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        private: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        modified_at: {
            type: Date,
            default: null
        }
    }
)

const Channel = mongoose.model ('Channel', channelSchema)
export default Channel