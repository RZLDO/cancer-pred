import pasientController from "../controllers/pasientController.mjs";
import authenticate from "../middlewares/middleware.mjs";
import multer from "multer";
import express from 'express'

const upload = multer();
const pasientRoute = express.Router(); 

pasientRoute.get('/pasient', authenticate, pasientController.getPasient);
pasientRoute.get('/pasient/account/:id', authenticate,pasientController.getPasientByAccountId)
pasientRoute.get('/pasient/:id',authenticate, pasientController.getPasientById) 
pasientRoute.post('/pasient', authenticate,upload.any(), pasientController.createNewPasient)
pasientRoute.get('/summaries/pasient', authenticate, pasientController.getSummariesPatient)

export default pasientRoute;