
import { Request } from 'express';
import mongoose from 'mongoose';

export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  profilePic?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  name: string;
  confirmPassword: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  profilePic?: string;
}

export interface BlogPayload {
  _id: string;
  title: string;
  desciption:string;
  body: string;
  coverImage?: string;
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId; // Reference to User
    name: string;
    email: string;
    profilePic?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Request with user added by auth middleware
export interface AuthRequest extends Request {
  user?: JwtPayload;
  file?: Express.Multer.File;
}

export interface BlogRequest extends Request {
  blog: BlogPayload;
  file?: Express.Multer.File;
  user?: JwtPayload;
}