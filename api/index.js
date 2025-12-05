import app from '../app.js';
import connectDB from '../db/connect.js';

let isConnected = false;

// 🔹 Conexión MongoDB serverless
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB(process.env.MONGO_URL);
      isConnected = true;
      console.log('MongoDB conectado ✔️');
    } catch (err) {
      console.error('Error conectando MongoDB:', err);
      return res.status(500).send('Error de base de datos');
    }
  }
  next();
});

export default app;
