import { Router } from 'express';
import { createProduct, getProducts, getProduct } from '../controllers/product.controller';

export const ProductRouter: Router = Router();

ProductRouter.get('/', getProducts);
ProductRouter.get('/:name', getProduct);

ProductRouter.post('/', createProduct);
