import userRepository from "../repository/userRepository.mjs";
import { successResponse, errorResponse } from "../utils/apiResponseUtils.mjs";
import dotenv from 'dotenv'; 
import jwt from 'jsonwebtoken';
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
    }
}

export default userController;