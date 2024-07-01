import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';

export const ProductRouter: Router = Router();

ProductRouter.get('/', getProducts);
ProductRouter.get('/:productId', getProduct);

ProductRouter.post('/', createProduct);
ProductRouter.put('/:productId', updateProduct);
ProductRouter.delete('/:productId', deleteProduct);
