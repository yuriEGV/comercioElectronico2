/*const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
*/
/*import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
};

export default connectDB;

*/


import mongoose from 'mongoose';

const connectDB = async (url) => {
  if (!url) {
    throw new Error('MONGO_URL no está definida en las variables de entorno');
  }

  try {
    const conn = await mongoose.connect(url);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error; // relanzar error para que Vercel lo capture
  }
};

export default connectDB;

