import mongoose from "mongoose";
import { Schema } from "mongoose";


const workspaceSchema = new mongoose.Schema (
    { 
        name: {type: String,
            required: true
        },
        url_img: {
            type: String},
        modified_at: {
            type: Date,
        },
        created_at: {
            type: Date, default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        }
    }
)

const Workspaces = mongoose.model ('Workspace', workspaceSchema)
export default Workspaces