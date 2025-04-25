
import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { verifyToken } from '../middlewares/auth';
import { uploadProfilePic } from '../middlewares/upload';

const router = Router();

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
], authController.login);

// Signup route
router.post('/signup', 
  uploadProfilePic,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ], 
  authController.signup
);

// Protected route - get user info
router.get('/me', verifyToken, authController.getMe);

export default router;