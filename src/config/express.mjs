import express from 'express';
import userRoutes from '../routes/userRoutes.mjs';

const configExpress = express();
configExpress.use(express.json());
configExpress.use('/users', userRoutes);
export default configExpress;
