import express, { request, response } from 'express'
import WorkspacesRepository from '../repositories/workspace.repository.js'
import { validarId } from '../utils/validations.utils.js'
import { ServerError } from '../utils/customError.utils.js'

class WorkspaceController {
    static async post (request, response){
        try {
            const { name, url_img } = request.body;
        
            if (!name || typeof name !== 'string' || name.length > 30) {
              throw new ServerError (400, 
                'el campo "name" debe ser un string de menos de 30 caracteres' )
            }
        
            if (!url_img || typeof url_img !== 'string' || url_img.length > 30) {
              throw new ServerError (400,
                "el campo 'url_img' debe ser un string de menos de 30 caracteres" )
            }
        
            const nuevoWorkspace = await WorkspacesRepository.createWorkspace(name, url_img);
        
            return response.status(201).json({
              ok: true,
              status: 201,
              message: 'Workspace creado con éxito',
              data: nuevoWorkspace
            });
        
          } catch (error) {
            console.error(error);
            if (error.status){
              return response.status(error.status).json ({
                ok: false,
                status: error.status,
                message: error.message
              }
              )
            }
            else {return response.status(500).json({
              ok: false,
              status: 500,
              message: 'Error interno del servidor'
            });}
          }
        };



        static async GetById (request, response){
            try {
                const workspace_id = request.params.workspace_id;
            
                if (!validarId(workspace_id)) {
                  return response.status(400).json({
                    ok: false,
                    message: 'workspace_id debe ser un id valido'
                  });
                }
            
                const workspace = await WorkspacesRepository.getById(workspace_id);
            
                if (!workspace) {
                  return response.status(404).json({
                    ok: false,
                    message: `Workspace con id ${workspace_id} no encontrado`
                  });
                }
            
                response.json({
                  ok: true,
                  message: `Workspace con id ${workspace._id} obtenido`,
                  data: { workspace: workspace }
                });
              } catch (error) {
                console.error(error);
                response.status(500).json({
                  ok: false,
                  message: 'Error interno del servidor'
                });
              }
        }

        
        static async GetAll (request, response){
            try {
                const workspace = await WorkspacesRepository.getAll();
                response.json({
                  ok: true,
                  message: 'workspaces obtenidos',
                  workspace: workspace
                });
              } catch (error) {
                console.error(error);
                response.status(500).json({
                  ok: false,
                  message: 'Error interno del servidor'
                });
              }
        }
    }
export default WorkspaceController