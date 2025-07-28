import {passientModel, predictionsModel, accountModel} from '../model/defineDatabaseRelations.mjs'
import database from "../config/database.mjs";

const predictionsRepository = {
    async createPredition(
        data,
        idPasient,
        diagnosis, 
        probabilitas,
    ){
        const predictionData = {
            ...data,
            idPasien : idPasient,
            diagnosis : diagnosis,
            probabilitas : probabilitas,
        };

        return await  predictionsModel.create(predictionData)
    }, 

    async updateDokumenFile(idPemeriksaan, linkFile){
        const predictions = await predictionsModel.findOne(
            {
                where : { 
                    idPemeriksaan : idPemeriksaan,
                }
            },
        )

        return await predictions.update({
            file : linkFile
        })
    }, 

    async getPredictions(
        page, limit
    ){
        const offset = (page - 1) * limit;
        return await predictionsModel.findAndCountAll({
            limit : limit,
            offset : offset,
            order: [['createdAt', 'DESC']], 
            include : {
                model : passientModel,
                as : "pasient",
                include  : { 
                    model : accountModel, 
                    as  : 'user'
                }
            }
        })
    },

    async updatePrediction(
        id,
        updateData
    ){
        const prediction = await predictionsModel.findOne({
            where : {
                idPemeriksaan : id
            }
        })

        if(!prediction){
            const error =  new Error('Data pemeriksaan tidak ditemukan'); 
            error.status = 404
            throw error;
        }
        return await prediction.update(updateData)
    },

    async deletePrediction(id){
        const prediction = await predictionsModel.findOne({
            where : {
                idPemeriksaan : id
            }
        })

        if(!prediction){
            const error =  new Error('Data pemeriksaan tidak ditemukan'); 
            error.status = 404
            throw error;
        }

        await prediction.destroy()
    },
    async getSummaryPemeriksaan() {
        const [result] = await database.query(`
          SELECT 
            ROUND(AVG(probabilitas) * 100, 2) AS rata_rata_probabilitas_persen,
            SUM(CASE WHEN diagnosis = 'B' THEN 1 ELSE 0 END) AS total_benign,
            SUM(CASE WHEN diagnosis = 'M' THEN 1 ELSE 0 END) AS total_malignant
          FROM data_pemeriksaan
        `);
        console.log(result);
        return result;
      },
    
      async getSummaryDiagnosis() {
        const [result] = await database.query(`
          SELECT 
            SUM(CASE WHEN diagnosis = 'B' THEN 1 ELSE 0 END) AS total_benign,
            SUM(CASE WHEN diagnosis = 'M' THEN 1 ELSE 0 END) AS total_malignant
          FROM data_pemeriksaan
        `);
        console.log(result);
        return result;
      }
      
}

export default predictionsRepository;