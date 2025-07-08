import trainingModel from "../model/trainingModel.mjs";

const trainingRepository = {
    async createTrainings(
        trainings 
    ){ 
        const mappedData = trainings.map(item => ({
            diagnosis: item.diagnosis,
            radiusMean: parseFloat(item.radius_mean),
            textureMean: parseFloat(item.texture_mean),
            perimeterMean: parseFloat(item.perimeter_mean),
            areaMean: parseFloat(item.area_mean),
            smoothnessMean: parseFloat(item.smoothness_mean),
            compactnessMean: parseFloat(item.compactness_mean),
            concavityMean: parseFloat(item.concavity_mean),
            inputDate: new Date(), // atau dari CSV jika ada
          }));
          
       return await trainingModel.bulkCreate(mappedData, { validate: true });
    }, 

    async createTraining(
        training
    ){
        return await trainingModel.create({
            ...training, 
            inputDate : new Date()
        });
    },

    async fetchTrainingPaging(
        page,
        limit,
    ){
        const offset = (page - 1) * limit;
        return await trainingModel.findAndCountAll({
            limit : limit,
            offset : offset,
            order: [['createdAt', 'DESC']], 
        });
    }, 

    async updateTraining(id, updateTraining) {
        console.log( updateTraining);
        const training = await trainingModel.findOne({
          where: { idTraining: id }
        });
      
        if (!training) {
          throw new Error('Data training tidak ditemukan');
        }
      
        return await training.update(updateTraining);
    },
    
    async deleteTraining(id) {
        const training = await trainingModel.findOne({
            where: { idTraining: id }
          });
        
          if (!training) {
            throw new Error('Data training tidak ditemukan');
          }
        
          await training.destroy();
    }, 
    async getAllTraining(){ 
        return await trainingModel.findAll();
    }
      
}

export default trainingRepository;