
import { Request } from 'express';

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
}

// Request with user added by auth middleware
export interface AuthRequest extends Request {
  user?: JwtPayload;
  file?: Express.Multer.File;
}