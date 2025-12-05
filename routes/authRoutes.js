import express from 'express';
const router = express.Router();

import { register, login, logout, showMe } from '../controllers/authController.js';
import { authenticateUser, authorizePermissions } from '../middleware/authentication.js';
import { optionalAuthenticateUser } from '../middleware/optional-auth.js';

// rutas
router.post('/register', register);
router.post('/login', login);
router.get('/logout', authenticateUser, logout);
router.get('/showMe', optionalAuthenticateUser, showMe);

// export default para ESM
export default router;
