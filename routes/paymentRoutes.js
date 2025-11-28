/*const express = require('express');
const router = express.Router();
const { initTransaction, commitTransaction, returnTransaction } = require('../controllers/webpayController');
const { initOnepay, commitOnepay } = require('../controllers/onepayController');

router.post('/webpay/init', initTransaction);
router.post('/webpay/commit', commitTransaction);
// Transbank will POST to this endpoint (token_ws) when user returns from payment
router.post('/webpay/return', returnTransaction);
router.post('/onepay/init', initOnepay);
router.post('/onepay/commit', commitOnepay);

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const { initTransaction, commitTransaction } = require('../controllers/webpayController');

router.post('/webpay/init', initTransaction);
router.post('/webpay/commit', commitTransaction);

module.exports = router;
