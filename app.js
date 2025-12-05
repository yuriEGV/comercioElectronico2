import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

// routers
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import { errorHandlerMiddleware } from './middleware/error-handler.js';

const app = express();

// 🔹 Seguridad y protección
app.set('trust proxy', 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(xss());
app.use(mongoSanitize());

// 🔹 Stripe Webhook (antes de express.json())
app.use('/payments/webhook', express.raw({ type: 'application/json' }), paymentRouter);

// 🔹 Middleware normales
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public')); // favicons, imágenes, CSS
app.use(fileUpload());

// 🔹 Logging opcional para depuración
app.use((req, res, next) => {
  console.log('Request a:', req.url);
  next();
});

// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>API Comercio Electrónico</title>
      </head>
      <body>
        Bienvenido a la API de Comercio Electrónico
      </body>
    </html>
  `);
});

// 🔹 Rutas API
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/reviews', reviewRouter);
app.use('/orders', orderRouter);
app.use('/payments', paymentRouter);

// 🔹 Middleware de errores (final)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
