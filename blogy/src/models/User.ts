
import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '../types/user';

export interface UserDocument extends Omit<UserType, 'id'>, Document {
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true
  }
);

// Don't return the password when converting to JSON
UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    delete ret.password;
    return ret;
  }
});

export const User = mongoose.model<UserDocument>('User', UserSchema);