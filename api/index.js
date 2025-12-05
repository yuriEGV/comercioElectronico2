import 'dotenv/config';
import app from '../app.js';
import connectDB from '../db/connect.js';

// 🟢 CONEXIÓN A MONGO EN VERCEL (serverless)
let isConnected = false;

// Middleware para conectar MongoDB en Vercel
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
