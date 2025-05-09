import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controller/productController.mjs';

const router = express.Router();

router.get('/:id', getProductById);
router.get('/random',getProductByRandom)
export default router;
