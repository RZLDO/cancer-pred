import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import xlsx from 'xlsx';
import { errorResponse, successResponse } from "../utils/apiResponseUtils.mjs";
import trainingRepository from '../repository/trainingRepository.mjs';
import axios from 'axios';

const allowedFields = [
  'diagnosis',
  'radius_mean',
  'perimeter_mean',
  'area_mean',
  'smoothness_mean',
  'compactness_mean',
  'concavity_mean',
  'texture_mean'
];

const trainingController = {
  
  async uploadTrainingData(req, res) {
    try {
      const file = req.file;
      if (!file) {
        return errorResponse(res, {
          statusCode: 400,
          message: "No file uploaded",
        });
      }
      const ext = path.extname(file.originalname).toLowerCase();
      const data = [];

      if (ext === '.csv') {
        const filePath = path.resolve(file.path);
        const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, trim: true }));
        for await (const row of parser) {
          const filtered = {};
          for (const key of allowedFields) {
            if (row[key] !== undefined) {
              filtered[key] = row[key];
            }
          }
          data.push(filtered);
        }
      } else if (ext === '.xlsx') {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        for (const row of jsonData) {
          const filtered = {};
          for (const key of allowedFields) {
            if (row[key] !== undefined) {
              filtered[key] = row[key];
            }
          }
          data.push(filtered);
        }
      } else {
        return errorResponse(res, {
          statusCode: 400,
          message: "Unsupported file type",
        });
      }
      await trainingRepository.createTrainings(data)
      const response = await axios.get(`${process.env.ML_API_URL}/retrain`);
      console.log(response);
      return successResponse(res, {
        statusCode: 201,
        message: "Upload data and retraining model successfully",
        data: {
          metrics : response.data.data.metrics,
          classDistribution : response.data.data.class_distribution
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      return errorResponse(res, {
        statusCode: error.status || 500,
        message: error.message,
      });
    }
  },

  async createTraining(req, res){
    try{
        const data = req.body;
        const training = await trainingRepository.createTraining(
            data
        )
        return successResponse(res, {
            statusCode : 201,
            message : 'create pasient success', 
            data : {
                pasient : training
            }
        })
    }catch(error){
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message,
            });
    }
  },

  async deleteTraining(req, res){
    try{
        const {id} = req.params;
        await trainingRepository.deleteTraining(id);

        return successResponse(res, {
            statusCode : 200,
            message : 'success delete training data', 
        });

    }catch(error){
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message,
            });
    }
  },

  async updateTraining(req, res){
     try{
        const {id} = req.params;
        const data = req.body; 
        const updatedData = await trainingRepository.updateTraining(id,data);

        return successResponse(res,{ 
            statusCode : 200, 
            message : 'success update data', 
            data : {
                training : updatedData
            }
        })
     }catch(error){
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message,
            });
     }
  }, 

  async getTrainingData(req, res){
    try{
        const { page = 1, limit = 10, } = req.query;
        const trainings = await trainingRepository.fetchTrainingPaging(
            parseInt(page), 
            parseInt(limit)
        );

        return successResponse(res, {
            statusCode : 200, 
            message : 'success fetch data', 
            data : {
                totalData: trainings.count,
                currentPage: parseInt(page),
                totalPage: Math.ceil(trainings.count / limit),
                trainings : trainings.rows  
            }
        });
    }catch(error){
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message,
            });
    }
  },
  async getTrainingSummaries(req, res){
    try{
       
        const trainings = await trainingRepository.getTrainingSummaries()

        return successResponse(res, {
            statusCode : 200, 
            message : 'success fetch data', 
            data : trainings
        });
    }catch(error){
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message,
            });
    }
  },
};

export default trainingController;
