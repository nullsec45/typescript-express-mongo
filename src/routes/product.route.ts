import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { requireAdmin } from '../middleware/auth';

export const ProductRouter: Router = Router();

ProductRouter.get('/', getProducts);
ProductRouter.get('/:productId', getProduct);

ProductRouter.post('/', requireAdmin, createProduct);
ProductRouter.put('/:productId', requireAdmin, updateProduct);
ProductRouter.delete('/:productId', requireAdmin, deleteProduct);
