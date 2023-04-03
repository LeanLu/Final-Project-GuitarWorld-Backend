import { model, Schema } from 'mongoose';
import { UserStructure } from '../entities/user.model';

const userSchema = new Schema<UserStructure>({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  myGuitars: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Guitar',
    },
  ],

  token: {
    type: String,
  },
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
