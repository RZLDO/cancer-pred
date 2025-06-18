import express from 'express';
import multer from 'multer';
import authController from '../controllers/authController.mjs';

const upload = multer();
const authRoutes =  express.Router();

authRoutes.post('/auth/register', upload.any(), authController.register);
authRoutes.post('/auth/login', upload.any(), authController.login);

export default authRoutes;
