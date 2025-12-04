import Product from '../models/Product.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

// Crear producto
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products });
};

// Obtener un solo producto
const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError('Product not found');
  res.status(200).json({ product });
};

// Actualizar producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) throw new NotFoundError('Product not found');
  res.status(200).json({ product });
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new NotFoundError('Product not found');
  res.status(200).json({ msg: 'Product deleted' });
};

// Subir imagen (Cloudinary / local)
const uploadImage = async (req, res) => {
  if (!req.files) throw new BadRequestError('No file uploaded');
  const productImage = req.files.image;
  res.status(200).json({ image: productImage.name });
};

// Export ESModule
export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
};
