import database from "../config/database.mjs";
import { DataTypes, Sequelize } from "sequelize";


const predictionsModel = database.define(
    'data_pemeriksaan',
    {
        idPemeriksaan : {
            type : DataTypes.INTEGER, 
            primaryKey : true, 
            autoIncrement : true, 
            field : 'id_pemeriksaan'
        }, 
        idPasien :{
            type : DataTypes.INTEGER, 
            field : 'id_pasien'   
        }, 
        tanggalPemeriksaan : { 
            type : DataTypes.DATE, 
            defaultValue : Sequelize.NOW,
            field :'tanggal_pemeriksaan', 
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
        diagnosis : {
            type : DataTypes.STRING, 
            field : 'diagnosis'
        }, 
        probabilitas : {
            type : DataTypes.FLOAT,
            field : 'probabilitas'
        }, 
        file : {
            type : DataTypes.STRING,
            field : 'link_file'
        }, 
        createdAt : {
            type : DataTypes.DATE,
            defaultValue : Sequelize.NOW,
            field : 'created_at'
        }
    },
    {
        tableName : 'data_pemeriksaan', 
        timestamps : false   
    }
);

export default predictionsModel;