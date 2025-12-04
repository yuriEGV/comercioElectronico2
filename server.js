import 'dotenv/config';
import app from './app.js';
import connectDB from './db/connect.js';

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // Conectar a MongoDB
    if (process.env.MONGO_URL) {
      await connectDB(process.env.MONGO_URL);
    } else {
      console.warn('⚠️  MONGO_URL no está definida. Algunas funciones pueden no funcionar.');
    }

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
      console.log(`📡 API disponible en http://localhost:${port}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

start();

