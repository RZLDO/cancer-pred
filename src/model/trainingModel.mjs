import database from "../config/database.mjs";
import { DataTypes, Sequelize } from "sequelize";


const trainingModel = database.define(
    'data_training',
    {
        idTraining: {
            type : DataTypes.INTEGER, 
            primaryKey : true, 
            autoIncrement : true, 
            field : 'id_training'
        }, 
        inputDate : {
            type : DataTypes.DATE,
            defaultValue : Sequelize.NOW,
            field : 'tanggal_input'
        },
        radiusMean : {
            type : DataTypes.FLOAT, 
            field : 'radius_mean'
        },
        textureMean : {
            type : DataTypes.FLOAT,
            field : 'texture_mean'
        }, 
        perimeterMean : {
            type : DataTypes.FLOAT,
            field : 'perimeter_mean'
        }, 
        areaMean : { 
            type : DataTypes.FLOAT, 
            field : 'area_mean'
        }, 
        smoothnessMean : {
            type : DataTypes.FLOAT,
            field : 'smoothness_mean'
        }, 
        compactnessMean : {
            type : DataTypes.FLOAT,
            field : 'compactness_mean'
        }, 
        concavityMean : {
            type : DataTypes.FLOAT, 
            field : 'concavity_mean'
        },
        diagnosis: {
            type : DataTypes.STRING, 
            field : 'diagnosis'
        }, 
        
        createdAt : {
            type : DataTypes.DATE,
            defaultValue : Sequelize.NOW, 
            field : 'created_at'
        }
    },
    {
        tableName : 'data_training', 
        timestamps : false   
    }
);

export default trainingModel;