import pemeriksaanController from "../controllers/pemeriksaanController.mjs";
import authenticate from "../middlewares/middleware.mjs";
import multer from "multer";
import express from 'express'
import { pemeriksaanValidations } from "../validations/pemeriksaanValidations.mjs";
import { params } from "../validations/paramsValidations.mjs";
import { validateBody, validateParams } from "../middlewares/validate.mjs";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
    }
  });
  
const upload = multer({ storage: storage });
const pemeriksaanRoute = express.Router(); 

pemeriksaanRoute.get('/pemeriksaan', authenticate,pemeriksaanController.fetchPemeriksaan);
pemeriksaanRoute.patch('/pemeriksaan/account/:id', authenticate, validateParams(params),pemeriksaanController.updatePemeriksaan)
pemeriksaanRoute.delete('/pemeriksaan/:id',authenticate,validateParams(params), pemeriksaanController.deletePemeriksaan) 
pemeriksaanRoute.post('/pemeriksaan', authenticate,upload.single('ktpImage'), validateBody(pemeriksaanValidations), pemeriksaanController.createPemeriksaan)
pemeriksaanRoute.get('/summaries/pemeriksaan', authenticate, pemeriksaanController.getSummariesDiagnosis)
export default pemeriksaanRoute;