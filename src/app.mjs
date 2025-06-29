import express from 'express';
import database from './config/database.mjs';
import dotenv from 'dotenv';
import cors from 'cors';
import rolesRoute from './routes/rolesRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import pasientRoute from './routes/pasientRoutes.mjs';
import trainingRoutes from './routes/trainingRoutes.mjs';
import pemeriksaanRoute from './routes/pemeriksaanRoutes.mjs';

const app = express();
dotenv.config();
app.use(express.json());
app.use('/upload', express.static('upload'));

app.use(express.urlencoded({ extended: true }));
// cors setup 
app.use(cors());
// api routes here
app.use('/api', rolesRoute);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', pasientRoute);
app.use('/api', trainingRoutes);
app.use('/api', pemeriksaanRoute)

const port = process.env.API_PORT|| 7000;

app.listen(port, () => {
  database
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((error) => {
      console.error('Unable to connect to the database: ', error);
    });
  console.log(`Running on Port ${port}`);
});
