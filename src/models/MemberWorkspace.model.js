import { Schema } from "mongoose";
import mongoose from "mongoose";


const memberWorkspaceSchema = new mongoose.Schema (
    {
        //claves foraneas//
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }
)

const MembersWorkspace = mongoose.model ('MemberWorkspace', memberWorkspaceSchema)
export default MembersWorkspace