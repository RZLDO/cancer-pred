import rolesRepository from "../repository/rolesRepository.mjs";
import { successResponse, errorResponse } from '../utils/apiResponseUtils.mjs';

const rolesController = {
    async createRoles(req, res) {
        try {
            console.log("createroles")
          const { roleName } = req.body;
          if (!roleName) {
            const error = new Error('roles data is invalid check your request');
            error.status = 400;
            throw error;
          }
          console.log("error nih")
          const userRole = await rolesRepository.createUserRoles(roleName);
          return successResponse(res, {
            statusCode: 201,
            message: 'User role created successfully',
            data: { userRole: userRole },
          });
        } catch (error) {
            return errorResponse(res, {
                statusCode: error.status || 500,
                message: error.message,
              });
        }
    },
    async fetchRoles(req, res){
        try{
            const userRoles = await rolesRepository.fetchUserRoles();
            return successResponse(res, {
                statusCode : 200, 
                message : 'fetch user roles successfully',
                data : { userRoles }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode: error.status || 500,
                message: error.message,
              });
        }
    }
}

export default rolesController;