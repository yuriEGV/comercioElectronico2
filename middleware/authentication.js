// middleware/authentication.js (ESM)

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { UnauthenticatedError, UnauthorizedError } from '../errors/index.js';

// Middleware para rutas que requieren usuario autenticado
export const authenticateUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      throw new UnauthenticatedError('Authentication Invalid');
    }

    req.user = user;

    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

// Middleware para verificar roles -> admin, owner, etc
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};
