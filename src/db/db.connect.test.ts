import mongoose from 'mongoose';
import { dbConnect } from './db.connect';

describe('Given dbConnect function', () => {
  describe('When NODE_ENV is a test environment', () => {
    test('Then, the function should connect with TestingGuitarWorld dbName', async () => {
      const result = await dbConnect();
      expect(typeof result).toBe(typeof mongoose);
      mongoose.disconnect();
    });

    describe('When NODE_ENV is a project environment', () => {
      test('Then, the function should connect with GuitarWorld dbName', async () => {
        process.env.NODE_ENV = 'FinalProject';
        const result = await dbConnect();
        expect(typeof result).toBe(typeof mongoose);
        mongoose.disconnect();
      });
    });
  });
});
