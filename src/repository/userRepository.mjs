import { accountModel } from '../model/defineDatabaseRelations.mjs'

const userRepository = {
    async getUserDetail(userId){
        const user = await accountModel.findOne({
            where : {
                idAccount : userId
            }
        })

        if(!user){
            const error = new Error("user not found"); 
            error.status = 404 
            throw error;
        }
        return user;
    },

    async changeUserPassword(userId, newPassword){
        const user = await accountModel.findOne({
            where : { 
                idAccount : userId
            }
        })

        if(!user){
            const error = new Error("user not found");
            error.status = 404; 
            throw error;
        }
        return await user.update(
            {
                password : newPassword
            }
        )
    }
}

export default userRepository;