import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const databaseName = process.env.DATABASE_NAME; 
const username = process.env.DATABASE_USERNAME;
const host = process.env.DATABASE_HOST;

const database = new Sequelize(databaseName, username, null, {
  host: host,
  dialect: 'mysql',
});

export default database;
