const { isTokenValid } = require('../utils');

const optionalAuthenticateUser = async (req, res, next) => {
  try {
    let token = req.signedCookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const { name, userId, role } = isTokenValid({ token });
      req.user = { name, userId, role };
    } else {
      req.user = null;
    }
  } catch (e) {
    req.user = null;
  } finally {
    next();
  }
};

module.exports = { optionalAuthenticateUser }; 