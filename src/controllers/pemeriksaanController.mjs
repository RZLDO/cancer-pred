import predictionsRepository from "../repository/pemeriksaanRepository.mjs";
import pasientRepository from "../repository/pasientRepository.mjs";
import { successResponse, errorResponse } from "../utils/apiResponseUtils.mjs";
import { runOCR } from "../service/ocr/ocrImplementations.mjs"



const pemeriksaanController = {
    async fetchPemeriksaan(req, res){
        try{
            const {page =1, limit =10} = req.query;

            const pemeriksaans = await predictionsRepository.getPredictions(
                parseInt(page),
                parseInt(limit)
            )

            return successResponse(res, {
                statusCode : 200, 
                message : 'fetch pemeriksaan success', 
                data : {
                    totalData: pemeriksaans.count,
                    currentPage: parseInt(page),
                    totalPage: Math.ceil(pemeriksaans.count / limit),
                    pemeriksaans : pemeriksaans.rows  
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode: error.status || 500,
                message: error.message,
              });
        }
    }, 
    async deletePemeriksaan(req, res){
        try{
            const {id} = req.params;
            await predictionsRepository.deletePrediction(id)

            return successResponse(res, {
                statusCode : 200, 
                message : 'delete pemeriksaan success', 
        
            })
        }catch(error){
            return errorResponse(res, {
                statusCode: error.status || 500,
                message: error.message,
              });
        }     
    },

    async createPemeriksaan(req,res){
        try{
            const data = req.body;
            const ktpImage = req.file;
            if(!ktpImage) {
                return errorResponse(res, {
                  statusCode: 400,
                  message: "No file uploaded",
                });
            }

            const ocrResult = await runOCR(ktpImage.path);
        
            
            const pasient = await pasientRepository.createNewpassient(ocrResult,data.idAccount)
            const pemeriksaan = await predictionsRepository.createPredition(data)

            return successResponse(res, {
                statusCode : 200, 
                message : 'fetch pemeriksaan success', 
                data : {
                    pemeriksaan : pemeriksaan 
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode: error.status || 500,
                message: error.message,
              });
        }
    },

    async updatePemeriksaan(req,res){
        try{
            const data = req.body;

            const pemeriksaan = await predictionsRepository.updatePrediction(data)

            return successResponse(res, {
                statusCode : 200, 
                message : 'fetch pemeriksaan success', 
                data : {
                    pemeriksaan : pemeriksaan 
                }
            })
        }catch(error){
            return errorResponse(res, {
                statusCode: error.status || 500,
                message: error.message,
              });
        }
    }
}

export default pemeriksaanController;