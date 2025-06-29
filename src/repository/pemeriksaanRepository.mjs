import predictionsModel from "../model/predictionModel.mjs";

const predictionsRepository = {
    async createPredition(
        data
    ){
        
        return await  predictionsModel.create(data)
    }, 

    async getPredictions(
        page, limit
    ){
        const offset = (page - 1) * limit;
        return await predictionsModel.findAndCountAll({
            limit : limit,
            offset : offset,
            order: [['createdAt', 'DESC']], 
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
    }
}

export default predictionsRepository;