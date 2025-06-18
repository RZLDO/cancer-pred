import database from "../config/database.mjs";
import { DataTypes, Sequelize} from "sequelize";

const passientModel = database.define(
    'data_pasien',
    {
        idPasient : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            autoIncrement : true, 
            primaryKey : true,
            field :'id_pasien'
        }, 
        idAccount : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            field :'id_account'
        }, 
        nama : {
            type : DataTypes.STRING,
            allowNull : false
        },
        jenisKelamin : { 
            type : DataTypes.ENUM(['L','P']), 
            allowNull : false,
            field : 'jenis_kelamin'
        }, 
        tanggalLahir : {
            type : DataTypes.DATE, 
            allowNull : false,
            field : 'tanggal_lahir'
        }, 
        alamat : {
            type : DataTypes.STRING, 
            allowNull : false, 
        }, 
        createdAt : {
            type : DataTypes.DATE, 
            defaultValue : Sequelize.NOW, 
            field : 'created_at'
        }
    },
    {
        tableName : 'data_pasien',
        timestamps : false
    }
)

export default passientModel;