import authRepository from "../repository/authRepository.mjs";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from "../utils/apiResponseUtils.mjs";
dotenv.config();

const authController = {
    async register(req,res){
        try{
            console.log("req.body:", req.body);

            const { username, password, roleId } = req.body;
            const hashPassword = await bcrypt.hash(password, 10);
        
            const createUser = await authRepository.register(
                username, 
                hashPassword,
                roleId
            );

            return successResponse(res, {
                statusCode : 201, 
                message : 'create user success', 
                data : {
                    user : createUser
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500, 
                message : error.message
            } )
        }
    },

    async login(req,res){
        try{
            
            const { username, password } = req.body;

            const user = await authRepository.login( 
                username,
                password,
            ); 
            
            const token = jwt.sign(
                {
                    username : username,
                    userId : user.idAccount
                }, 
                process.env.SECRET_KEY,
                {
                    expiresIn : '24h'
                }
            )

            return successResponse(res, {
                statusCode : 200, 
                message  : 'login success',
                data : {
                    token : token, 
                    user : user
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode : error.status || 500, 
                message : error.message
            } )
        }
    }
}

export default authController;