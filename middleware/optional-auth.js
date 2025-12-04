// optional-auth.js (ESM)

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const optionalAuthenticateUser = async (req, res, next) => {
  const token = req.cookies?.token;

  // Si no hay token → continuar sin usuario
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario en la base
    const user = await User.findById(payload.userId).select('-password');
    req.user = user || null;

    next();
  } catch (error) {
    // Token inválido pero la ruta sigue siendo opcional
    req.user = null;
    next();
  }
};
