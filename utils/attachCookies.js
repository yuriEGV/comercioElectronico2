import jwt from 'jsonwebtoken';

const attachCookies = ({ res, user }) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME || '1d',
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie('token', token, {
    httpOnly: true, // Previene acceso desde JavaScript (XSS)
    secure: isProduction, // Solo HTTPS en producción
    signed: false, // No firmado (cookie-parser no está configurado con secret)
    sameSite: isProduction ? 'none' : 'lax', // CSRF protection
    expires: new Date(Date.now() + oneDay),
  });
};

export default attachCookies;
