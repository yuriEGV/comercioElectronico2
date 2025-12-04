import express from 'express';
const router = express.Router();

import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} from '../controllers/productController.js';

router.route('/')
  .post(createProduct)
  .get(getAllProducts);

router.route('/:id')
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

router.post('/upload', uploadImage);

export default router;
