import express from 'express';

import { registerUser, loginUser, logoutUser } from '../controller/apiAuthController';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);
// Route for user login
router.post('/login', loginUser);

// Route for user logout
router.get('/logout', logoutUser);

export default router;