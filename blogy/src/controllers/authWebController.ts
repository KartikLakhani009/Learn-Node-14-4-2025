
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { LoginInput, SignupInput, AuthRequest } from '../types/user';
import { User } from '../models/User';
import { env } from '../config/env';
import { getToken } from '../utils/token';
import { default_avtar } from '../config/constants';


// Cookie config
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Display login form
export const getLogin = (req: Request, res: Response): void => {
  const returnTo = req.query.returnTo as string || '/';
  
  res.render('login', {
    pageTitle: 'Login',
    errors: [],
    inputData: { email: '' },
    returnTo
  });
};

// Handle login form submission
export const postLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput;
  const returnTo = req.body.returnTo || '/';
  
  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', {
        pageTitle: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        inputData: { email },
        returnTo
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render('login', {
        pageTitle: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        inputData: { email },
        returnTo
      });
    }

    // Generate JWT token
    const token = getToken(user);

    // Set token in cookie
    res.cookie('token', token, COOKIE_OPTIONS);
    
    // Redirect to the returnTo path or homepage
    res.redirect(returnTo);
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      pageTitle: 'Login',
      errors: [{ msg: 'Server error, please try again' }],
      inputData: { email },
      returnTo
    });
  }
};

// Display signup form
export const getSignup = (req: Request, res: Response): void => {
  res.render('signup', {
    pageTitle: 'Sign Up',
    errors: [],
    inputData: { name: '', email: '' }
  });
};

// Handle signup form submission
export const postSignup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as SignupInput;
  const file = (req as AuthRequest).file;
  
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.render('signup', {
        pageTitle: 'Sign Up',
        errors: [{ msg: 'User with this email already exists' }],
        inputData: { name, email }
      });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: file ? `/uploads/profiles/${file.filename}` : default_avtar
    });
    
    // Generate JWT token
    const token = getToken(user);

    // Set token in cookie
    res.cookie('token', token, COOKIE_OPTIONS);
    
    // Redirect to the homepage
    res.redirect('/');
  } catch (error) {
    console.error('Signup error:', error);
    res.render('signup', {
      pageTitle: 'Sign Up',
      errors: [{ msg: 'Server error, please try again' }],
      inputData: { name, email }
    });
  }
};

// Handle logout
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};