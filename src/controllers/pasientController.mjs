import pasientRepository from "../repository/pasientRepository.mjs";
import { successResponse, errorResponse } from "../utils/apiResponseUtils.mjs";

const pasientController = {
     async getPasient(req, res){
        try{
            const pasient = await pasientRepository.fetchPasient();
            return successResponse(res, {
                statusCode : 201,
                message : 'fetch pasient success', 
                data : {
                    pasient : pasient
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500,
                message : error.message
            })
        }
     },
     
     async createNewPasient(req, res){
        try{
            const {
                idAccount, name, gender, birthDate, address
            } = req.body;
            
            if(!idAccount || !name || !gender || !birthDate || !address){
                const error = new Error('invalid request body');
                error.status = 400; 
                throw error;
            }
            const pasient = await pasientRepository.createNewpassient(
                idAccount, name, gender, birthDate, address
            )
            return successResponse(res, {
                statusCode : 201,
                message : 'create pasient success', 
                data : {
                    pasient : pasient
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500,
                message : error.message
            })
        }
     },

     async getPasientById(req, res){
        try{
            const { id } = req.params;
            
            if(!id){
                const error = new Error('id pasient is required');
                error.status = 400; 
                throw error;
            }
            const pasient = await pasientRepository.fetchPassientById(id)
            return successResponse(res, {
                statusCode : 201,
                message : 'fetch pasient success', 
                data : {
                    pasient : pasient
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500,
                message : error.message
            })
        }
     },

     async getPasientByAccountId(req, res){
        try{
            const { id } = req.params;
            
            if(!id){
                const error = new Error('id account is required');
                error.status = 400; 
                throw error;
            }
            const pasient = await pasientRepository.fetchPasientByAccountId(id);

            return successResponse(res, {
                statusCode : 201,
                message : 'fetch pasient success', 
                data : {
                    pasient : pasient
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500,
                message : error.message
            })
        }
     }
}

export default pasientController;