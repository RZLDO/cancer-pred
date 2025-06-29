import express from 'express';
import multer from 'multer';
import authController from '../controllers/authController.mjs';
import { loginSchema, registerSchema } from '../validations/authValidations.mjs';
import { validateBody } from '../middlewares/validate.mjs';

const upload = multer();
const authRoutes =  express.Router();

authRoutes.post('/auth/register',upload.none(), validateBody(registerSchema), authController.register);
authRoutes.post('/auth/login', upload.none(),validateBody(loginSchema), authController.login);

export default authRoutes;
