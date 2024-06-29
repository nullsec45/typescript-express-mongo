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

export const getDetailProductDB = async (name: string) => {
  return await productModel
    .find({ name })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      logger.info('cannot get data detail product from DB');
      logger.error(error);
      return [];
    });
};
