const express = require('express');
const router = express.Router();

const { register, login, logout, showMe } = require('../controllers/authController'); // 👈 FALTA showMe
const authMiddleware = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/showMe', authMiddleware.authenticateUser, showMe);

module.exports = router;

