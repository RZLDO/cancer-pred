import express from 'express';
import userController from '../controllers/userController.mjs';
import authenticate from '../middlewares/middleware.mjs';
import { validateParams } from '../middlewares/validate.mjs';
import { params } from '../validations/paramsValidations.mjs';
import multer from 'multer';

const upload = multer();

const userRoutes = express.Router();

userRoutes.get('/user',authenticate, userController.getUserDetail);
userRoutes.get('/users',authenticate, userController.getAllUser);
userRoutes.patch('/user/:id', authenticate,upload.none(), validateParams(params), userController.updateAccount)
userRoutes.patch('/user/change-password/:id', authenticate, upload.none(),validateParams(params), userController.changeUserPassword)
userRoutes.delete('/user/:id', authenticate, upload.none(), validateParams(params), userController.deleteAccount)
userRoutes.get('/user/:id',authenticate,upload.none(),validateParams(params), userController.getUserById)
export default userRoutes;
