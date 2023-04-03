/* eslint-disable no-negated-condition */
import mongoose from 'mongoose';
import { config } from '../config.js';

const { DB_USER, DB_PASSWORD, DB_CLUSTER } = config;

export const dbConnect = () => {
  const dbName =
    process.env.NODE_ENV !== 'test' ? 'GuitarWorld' : 'TestingGuitarWorld';

  const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${dbName}?retryWrites=true&w=majority`;

  return mongoose.connect(uri);
};
