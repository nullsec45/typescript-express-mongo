import type ProductType from '../types/product.type';
import productModel from '../models/product.model';
import { logger } from '../utils/logger';

export const getProductDB = async () => {
  return await productModel
    .find()
    .then((data) => {
      return data || [];
    })
    .catch((error) => {
      logger.info('cannot get all data product from DB');
      logger.error(error);
    });
};

export const getDetailProductDB = async (productId: string) => {
  return await productModel
    .find({ product_id: productId })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      logger.info('cannot get data detail product from DB');
      logger.error(error);
      return [];
    });
};

export const addProductDB = async (payload: ProductType) => {
  return await productModel.create(payload);
};
