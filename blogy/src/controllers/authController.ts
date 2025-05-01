
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { LoginInput, SignupInput, AuthRequest } from '../types/user';
import { User } from '../models/User';
import { getToken } from '../utils/token';
import { default_avtar } from '../config/constants';

// API Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput;
  
  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = getToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// API Signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, confirmPassword } = req.body as SignupInput;
  const file = (req as AuthRequest).file;
  
  try {
    // Validate passwords match
    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({ message: 'User already exists with this email' });
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: file ? `/uploads/profiles/${file.filename}` : default_avtar
    });
    
    // Generate JWT token
    const token = getToken(user);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user info
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  
  try {
    const user = await User.findById(authReq.user.userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};