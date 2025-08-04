
import express from 'express';
import multer from 'multer';
import authenticate from '../middlewares/middleware.mjs';
import trainingController from '../controllers/trainingController.mjs';
import { trainingValidations } from '../validations/trainingValidations.mjs';
import { validateBody } from '../middlewares/validate.mjs';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

const trainingRoutes =  express.Router();

trainingRoutes.post('/trainings', authenticate, upload.single('file'), trainingController.uploadTrainingData);
trainingRoutes.post('/training', authenticate,upload.none(), trainingController.createTraining);
trainingRoutes.patch('/training/:id', authenticate, upload.none(), validateBody(trainingValidations), trainingController.updateTraining);
trainingRoutes.get('/training', authenticate, trainingController.getTrainingData);
trainingRoutes.delete('/training/:id', authenticate, trainingController.deleteTraining)
trainingRoutes.get('/summaries/training', authenticate, trainingController.getTrainingSummaries )


export default trainingRoutes;
