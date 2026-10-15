import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.types.js';

export type UserDocument = Document<unknown, object, IUser> & IUser;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = (ret['_id'] as { toString: () => string }).toString();
        delete ret['_id'];
        delete ret['__v'];
        delete ret['passwordHash'];
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
