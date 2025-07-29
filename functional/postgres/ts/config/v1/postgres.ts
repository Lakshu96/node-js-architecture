import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Validate environment variables
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error('Missing required database environment variables.');
}

// Create Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'postgres',
  host: DB_HOST,
  logging: false,
});

// Authenticate
sequelize.authenticate()
  .then(() => {
    console.log('Connected to postgres');
  })
  .catch((err: any) => {
    console.error('Error connecting to postgres:', err.message);
  });

export  {sequelize};
