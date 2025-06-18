import sequelize from "../config/database.mjs";
import { DataTypes } from "sequelize";

const userRolesModel = sequelize.define(
    'roles',
    {
        idRoles : {
            type : DataTypes.INTEGER, 
            primaryKey : true, 
            autoIncrement : true, 
            field : 'id_role'
        }, 
        roleName : {
            type : DataTypes.STRING,
            allowNull : false,
            field : 'role_name'
        }
    }, 
    {
        tableName : 'roles', 
        timestamps : false
    }
)

export default userRolesModel;

