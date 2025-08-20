/*const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const attachCookiesToResponse = require('./attachCookiesToResponse');
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
};
*/


const { createJWT, isTokenValid } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const attachCookiesToResponse = require('./attachCookiesToResponse'); // Solo UNA VEZ

module.exports = {
  createJWT,
  isTokenValid,
  createTokenUser,
  attachCookiesToResponse,
};
