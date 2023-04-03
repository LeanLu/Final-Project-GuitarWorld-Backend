import dotenv from 'dotenv';

dotenv.config();

export const config = {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_CLUSTER: process.env.DB_CLUSTER,
  SECRET: process.env.SECRET,
  PORT: process.env.PORT,
};
