import express from 'express';
import userController from '../controllers/userController.mjs';
import authenticate from '../middlewares/middleware.mjs';

const userRoutes = express.Router();

userRoutes.get('/user',authenticate, userController.getUserDetail);
userRoutes.get('/users',authenticate, userController.getAllUser);

export default userRoutes;
