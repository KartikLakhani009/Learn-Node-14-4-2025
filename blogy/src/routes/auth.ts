
import { Router } from 'express';
import * as authWebController from '../controllers/authWebController';
import { validateLogin, validateSignup } from '../middlewares/validation';
import { isNotAuthenticated } from '../middlewares/auth';
import { uploadProfilePic } from '../middlewares/upload';

const router = Router();

// Routes for login page
router.get('/login', isNotAuthenticated, authWebController.getLogin);
router.post('/login', isNotAuthenticated, validateLogin, authWebController.postLogin);

// Routes for signup page
router.get('/signup', isNotAuthenticated, authWebController.getSignup);
router.post('/signup', isNotAuthenticated, uploadProfilePic, validateSignup, authWebController.postSignup);

// Route for logout
router.post('/logout', authWebController.logout);

export default router;