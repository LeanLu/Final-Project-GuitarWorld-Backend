import { model, Schema } from 'mongoose';
import { GuitarStructure } from '../entities/guitar.model';

const guitarSchema = new Schema<GuitarStructure>({
  brand: {
    type: String,
    required: true,
  },

  modelGuitar: {
    type: String,
    required: true,
  },

  picture: {
    type: String,
    required: true,
  },

  style: {
    type: String,
    required: true,
  },

  material: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

guitarSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const GuitarModel = model('Guitar', guitarSchema, 'guitars');
