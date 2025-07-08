import predictionsRepository from "../repository/pemeriksaanRepository.mjs";
import pasientRepository from "../repository/pasientRepository.mjs";
import userRepository from "../repository/userRepository.mjs";
import { successResponse, errorResponse } from "../utils/apiResponseUtils.mjs";
import { runOCR } from "../service/ocr/ocrImplementations.mjs"
import { generateDocx } from "../service/method/document.mjs";
import axios from "axios";



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
            const { nama, jenisKelamin, tanggalLahir, alamat, nik } = data;
            
            if (!ktpImage && (!nama || !jenisKelamin || !tanggalLahir || !alamat)) {
              return errorResponse(res, {
                statusCode: 400,
                message: "Either upload a KTP image or provide all required fields",
              });
            }
            
            let pasient;
            
            if (ktpImage) {
              const ocrResult = await runOCR(ktpImage.path);
              pasient = await pasientRepository.createNewpassientWithOcr(ocrResult, data.idAccount);
            } else {
              pasient = await pasientRepository.createNewpassient(
                nama,
                jenisKelamin,
                tanggalLahir,
                alamat,
                data.idAccount
              );
            }
            
            const request = {
                radiusMean : data.radiusMean, 
                textureMean : data.textureMean, 
                perimeterMean : data.perimeterMean, 
                areaMean : data.areaMean, 
                smoothnessMean : data.smoothnessMean, 
                compactnessMean : data.compactnessMean, 
                concavityMean : data.concavityMean,
            }
            const response = await axios.post(`${process.env.ML_API_URL}/predict`, request);
            
            
            const pemeriksaan = await predictionsRepository.createPredition(
                data,
                pasient.idPasient, 
                response.data.data.diagnosis,
                response.data.data.probability
            )
            const dokter = await userRepository.getUserById(data.idAccount)
            const dokumenData = {
                nama : pasient.nama,
                id : pemeriksaan.idPemeriksaan,
                alamat : pasient.alamat, 
                tanggal : pasient.tanggalLahir,
                jenis_kelamin : pasient.jenisKelamin.toUpperCase().startsWith("L") ? "Laki-Laki" : "Perempuan", 
                dokter : dokter.name,
                radius : data.radiusMean, 
                texture: data.textureMean, 
                perimeter : data.perimeterMean, 
                area: data.areaMean, 
                smoothness : data.smoothnessMean, 
                compactness : data.compactnessMean, 
                concavity : data.concavityMean,
                diagnosis : response.data.data.diagnosis.toUpperCase().startsWith("M") ? "Melignan" : "Benigna", 
                probabilitas : (response.data.data.probability * 100).toFixed(2)
            }
            const linkFile = generateDocx(dokumenData)
            const result = await predictionsRepository.updateDokumenFile(
                pemeriksaan.idPemeriksaan, 
                linkFile
            )
            return successResponse(res, {
                statusCode : 200, 
                message : 'fetch pemeriksaan success', 
                data : {
                    pemeriksaan : result
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