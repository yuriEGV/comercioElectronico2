import express from 'express';
const router = express.Router();

import { initTransaction, commitTransaction } from '../controllers/webpayController.js';

// rutas Webpay
router.post('/webpay/init', initTransaction);
router.post('/webpay/commit', commitTransaction);

// export default para ESM
export default router;
