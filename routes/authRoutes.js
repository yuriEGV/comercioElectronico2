const express = require('express');
const router = express.Router();

const { register, login, logout, showMe } = require('../controllers/authController'); // 👈 FALTA showMe
const authMiddleware = require('../middleware/authentication');
const { optionalAuthenticateUser } = require('../middleware/optional-auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/showMe', optionalAuthenticateUser, showMe);

module.exports = router;

