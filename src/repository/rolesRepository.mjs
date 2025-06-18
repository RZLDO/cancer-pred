import userRolesModel from "../model/roleModel.mjs";

const rolesRepository = {
    async fetchUserRoles() {
         return await userRolesModel.findAll();
    },

    async createUserRoles(roleName) {
        
        const userRole = await userRolesModel.findOne({
            where : {
                roleName : roleName
            }
        });
    
        if (userRole) {
          const error = new Error('user role has available on system');
          error.statusCode = 409;
          throw error;
        }
        
        return await userRolesModel.create(
            {
                roleName : roleName
            }
        );
    },
    
}

export default rolesRepository;