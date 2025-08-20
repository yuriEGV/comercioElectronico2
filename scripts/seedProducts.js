const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const User = require('../models/User');

const sampleProducts = [
  {
    name: 'PC Laptop Gaming',
    price: 899.99,
    description: 'Laptop de alto rendimiento para gaming con procesador Intel i7 y gráficos dedicados',
    image: '/uploads/pc laptop.jpeg',
    category: 'office',
    company: 'ikea',
    colors: ['#222', '#ff0000'],
    featured: true,
    freeShipping: true,
    inventory: 10,
  },
  {
    name: 'PC de Escritorio All-in-One',
    price: 1299.99,
    description: 'Computadora todo en uno con pantalla integrada de 24 pulgadas',
    image: '/uploads/PC-escritorio-all-in-one.jpg',
    category: 'office',
    company: 'ikea',
    colors: ['#222', '#ffffff'],
    featured: false,
    freeShipping: false,
    inventory: 5,
  },
  {
    name: 'Servidor Data Center',
    price: 2499.99,
    description: 'Servidor empresarial para data center con alta capacidad de procesamiento',
    image: '/uploads/data center.jpeg',
    category: 'office',
    company: 'marcos',
    colors: ['#222'],
    featured: true,
    freeShipping: true,
    inventory: 3,
  },
  {
    name: 'Servidor Data Center Pro',
    price: 3499.99,
    description: 'Servidor profesional para data center con redundancia y alta disponibilidad',
    image: '/uploads/data center 2.jpeg',
    category: 'office',
    company: 'marcos',
    colors: ['#222', '#c0c0c0'],
    featured: false,
    freeShipping: true,
    inventory: 2,
  },
  {
    name: 'Monitor Gaming 27"',
    price: 399.99,
    description: 'Monitor gaming de 27 pulgadas con 144Hz y resolución 4K',
    image: '/uploads/pantalla.jpg',
    category: 'office',
    company: 'liddy',
    colors: ['#222'],
    featured: true,
    freeShipping: false,
    inventory: 15,
  },
  {
    name: 'PC Desktop Gaming',
    price: 1599.99,
    description: 'PC de escritorio gaming con RTX 4070 y procesador AMD Ryzen 7',
    image: '/uploads/pc.jpeg',
    category: 'office',
    company: 'ikea',
    colors: ['#222', '#ff0000'],
    featured: true,
    freeShipping: true,
    inventory: 8,
  },
  {
    name: 'Sofá Gaming',
    price: 599.99,
    description: 'Sofá ergonómico para gaming con soporte lumbar y reposabrazos ajustables',
    image: '/uploads/couch.jpeg',
    category: 'bedroom',
    company: 'liddy',
    colors: ['#222', '#808080'],
    featured: false,
    freeShipping: false,
    inventory: 12,
  },
  {
    name: 'Computadores Reacondicionados',
    price: 299.99,
    description: 'Lote de computadores reacondicionados con garantía de 6 meses',
    image: '/uploads/Computadores_Reacondicionados_1170x.webp',
    category: 'office',
    company: 'marcos',
    colors: ['#222', '#ffffff'],
    featured: false,
    freeShipping: false,
    inventory: 20,
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Create admin user if doesn't exist
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');
    
    // Add user field to all products
    const productsWithUser = sampleProducts.map(product => ({
      ...product,
      user: adminUser._id
    }));
    
    // Insert sample products
    const products = await Product.create(productsWithUser);
    console.log(`${products.length} products created successfully`);
    
    // Display created products
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price} (${product.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 