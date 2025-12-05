import express from 'express';
const router = express.Router();

import { authenticateUser, authorizePermissions } from '../middleware/authentication.js';
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} from '../controllers/productController.js';

router.route('/')
  .post(authenticateUser, authorizePermissions('admin'), createProduct)
  .get(getAllProducts);

router.route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
  .delete(authenticateUser, authorizePermissions('admin'), deleteProduct);

router.post('/upload', authenticateUser, authorizePermissions('admin'), uploadImage);

export default router;
