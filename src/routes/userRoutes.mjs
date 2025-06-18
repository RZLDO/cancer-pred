import express from 'express';
import multer from 'multer';
import userController from '../controllers/userController.mjs';
import authenticate from '../middlewares/middleware.mjs';
const upload = multer();
const userRoutes = express.Router();

userRoutes.get('/user',authenticate, userController.getUserDetail);

export default userRoutes;
