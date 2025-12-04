import 'dotenv/config';
import 'express-async-errors';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

// database
import connectDB from './db/connect.js';

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

mongoose.set('strictQuery', true);

const app = express();

// seguridad
app.set('trust proxy', 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(xss());
app.use(mongoSanitize());

// ⚠️ STRIPE RAW WEBHOOK
app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentRouter
);

// ⚡ JSON normal
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);

// errores
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// 🟢 CONEXIÓN A MONGO EN VERCEL (serverless)
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB(process.env.MONGO_URL);
      isConnected = true;
      console.log('MongoDB conectado ✔️');
    } catch (err) {
      console.error('Error conectando Mongo:', err);
    }
  }
  next();
});

// 🟢 Exportación REQUERIDA por Vercel (NO usar app.listen)
export default app;
