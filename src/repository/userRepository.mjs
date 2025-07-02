import { accountModel, userRolesModel } from '../model/defineDatabaseRelations.mjs'

const userRepository = {
    async getUserDetail(userId){
        const user = await accountModel.findOne({
            attributes: ['idAccount','name', 'username',],
            where : {
                idAccount : userId
            },
            include : [
                {
                    model : userRolesModel,
                    as : 'role'
                }
            ]
        })

        if(!user){
            const error = new Error("user not found"); 
            error.status = 404 
            throw error;
        }
        return user;
    },

    async getAllUser(){
        const users = await accountModel.findAll({
            attributes: ['idAccount','name', 'username',],
            include : [
                {
                    model : userRolesModel,
                    as : 'role'
                }
            ]
        });
        return users;
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
    },

    async deleteAccount(id){
        const user = await accountModel.findOne({
          where : {
            idAccount : id
          }
        });
    
        if (!user) {
          const error = new Error('account not found');
          error.statusCode = 404;
          throw error;
        }
    
        await user.destroy();
      },
    
      async updateAccount(id,data){
        const user = await accountModel.findOne({
          where : {
            idAccount : id
          }
        });
    
        if (!user) {
          const error = new Error('account not found');
          error.statusCode = 404;
          throw error;
        }
    
        return await user.update(data);
      },
    
      async getUserById(id){
        const user = await accountModel.findOne({
          where : {
            idAccount : id
          }
        });
    
        if (!user) {
          const error = new Error('account not found');
          error.statusCode = 404;
          throw error;
        }
    
        return user;
      }
}

export default userRepository;