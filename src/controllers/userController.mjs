import userRepository from "../repository/userRepository.mjs";
import { successResponse, errorResponse } from "../utils/apiResponseUtils.mjs";
import dotenv from 'dotenv'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
dotenv.config(); 

const userController = {
    async getUserDetail(req, res){
        try{
            const token = req.headers.authorization;
            const secretKey = process.env.SECRET_KEY;
            let idAccount;
            jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
                if (err) {
                return res.status(403).json({ error: err });
                }
            
                idAccount = decoded.userId;
            });
            console.log("accountId", idAccount);
            const user = await userRepository.getUserDetail(idAccount);

            return successResponse(res, {
                statusCode : 200, 
                message : 'fetch detail user success', 
                data : {
                    user : user
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500, 
                message : error.message
            })
        }
    },

    async getAllUser(req, res){
        try{
            const token = req.headers.authorization;
            const secretKey = process.env.SECRET_KEY;
            let idAccount;
            jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
                if (err) {
                return res.status(403).json({ error: err });
                }
            
                idAccount = decoded.userId;
            });
            const user = await userRepository.getUserDetail(idAccount);
        
            if(user.role.idRoles !== 1 || user.role.roleName !== 'admin'){
                const error = new Error('not have permission');
                error.status = 401;
                throw error;
            } 
            const users = await userRepository.getAllUser();
            return successResponse(res, {
                statusCode : 200,
                message : 'fetch all user success',
                data : {
                    users : users
                }
            })
        } catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500,
                message : error.message
            })
        }
    },

    async getUserById(req,res){
        try{
            const { id } = req.params;
            const user = await userRepository.getUserById(id)

            return successResponse(res, {
                statusCode : 200, 
                message : 'fetch detail user success', 
                data : {
                    user : user
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500, 
                message : error.message
            })
        }
    },

    async changeUserPassword(req, res ){
        try{
            const {id} = req.params;
            const {newPassword} = req.body;
            const hashPassword = await bcrypt.hash(newPassword, 10);
            const user = await userRepository.changeUserPassword(
                id, hashPassword
            );

            return successResponse(res, {
                statusCode : 200, 
                message : 'change password success', 
                data : {
                    user : user
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500, 
                message : error.message
            })
        }
    },

    async deleteAccount(req, res){
        try{
            const {id} = req.params;
             await userRepository.deleteAccount(id)

            return successResponse(res, {
                statusCode : 200, 
                message : 'delete account success', 
                
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500, 
                message : error.message
            })
        }
    }, 

    async updateAccount(req, res){
        try{
            const data = req.body;
            const { id } = req.params;
            console.log(data);
            const user =  await userRepository.updateAccount(id,data)
            console.log(user);

            return successResponse(res, {
                statusCode : 200, 
                message : 'change data user success', 
                data : {
                    user : user
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

export default userController;