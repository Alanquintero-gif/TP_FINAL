import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongoDB.config.js";
import express from 'express'
import mongoose from "mongoose";
import workspace_router from "./routes/workspace.route.js";
import WorkspacesRepository from "./repositories/workspace.repository.js";
import auth_router from "./routes/auth.router.js";
import jwt from 'jsonwebtoken'
import UserRepository from "./repositories/user.repository.js";
import cors from 'cors'
import authMiddleware from "./middleware/auth.middleware.js";
import MembersWorkspaceRepository from "./repositories/memberworkspace.repository.js";

connectMongoDB ()


const app = express() 
app.use (cors())
app.use (express.json())


app.use('/api/workspace', workspace_router)
app.use ('/api/auth', auth_router)


app.listen(8080, 
    ()=> {
        console.log ("Funcionando")
    }) 


    // MembersWorkspaceRepository.create ('68dc6270b79fdd4c0ac5bd5c', '68b78ff4274c12f74f5c1fa7')

    MembersWorkspaceRepository.getAllWorkspacesByUserId ('68dc6270b79fdd4c0ac5bd5c')