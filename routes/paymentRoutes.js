import express from 'express';
const router = express.Router();

import { authenticateUser } from '../middleware/authentication.js';
import { initTransaction, commitTransaction } from '../controllers/webpayController.js';

// rutas Webpay - Requieren autenticación
router.post('/webpay/init', authenticateUser, initTransaction);
router.post('/webpay/commit', authenticateUser, commitTransaction);

// export default para ESM
export default router;
