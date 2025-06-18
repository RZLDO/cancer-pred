import sequelize from "../config/database.mjs";
import { DataTypes } from "sequelize";

const accountModel  = sequelize.define(
    'data_account', 
    {
        idAccount : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true, 
            allowNull : false,
            field : 'id_account'
        }, 
        username : {
            type : DataTypes.STRING, 
            allowNull : false, 
        }, 
        password : { 
            type : DataTypes.STRING, 
            allowNull : false
        }, 
        idRole : {
            type : DataTypes.INTEGER, 
            allowNull : false, 
            field : 'id_role'
        },
        createdAt : {
            type : DataTypes.DATE, 
            allowNull : true, 
            field : 'created_at'
        }
    },
    {
        tableName : 'data_account', 
        timestamps : false,
        underscored : true
    }
)

export default accountModel;