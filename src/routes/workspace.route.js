import express, { request, response } from 'express'
import WorkspacesRepository from '../repositories/workspace.repository.js'
import { validarId } from '../utils/validations.utils.js'
import { ServerError } from '../utils/customError.utils.js'
import WorkspaceController from '../controllers/workspace.controller.js'


const workspace_router = express.Router();

// GET todos los workspaces
workspace_router.get('/', WorkspaceController.GetAll);

// GET workspace por ID
workspace_router.get('/:workspace_id', WorkspaceController.GetById );

workspace_router.post('/', WorkspaceController.post)


  export default workspace_router;