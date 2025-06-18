import express from 'express';
import multer from 'multer';
import authenticate from '../middlewares/middleware.mjs';
import rolesController from '../controllers/rolesController.mjs';

const upload = multer();
const  rolesRoute =  express.Router();

rolesRoute.get('/roles', rolesController.fetchRoles);
rolesRoute.post('/roles', authenticate, upload.any(), rolesController.createRoles);

export default rolesRoute;
