import { type Request, type Response, type NextFunction } from 'express';
import { createProductValidation } from '../validations/product.validation';
import { logger } from '../utils/logger';
import { getDetailProductDB, getProductDB } from '../services/product.service';

// interface ProducType {
//   product_id: String;
//   name: String;
//   price: Number;
//   size: String;
// }

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await getProductDB();
  logger.info('access get route all data product');

  return res.status(200).send({
    stattus: true,
    statusCode: 200,
    data: products
  });
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('access get route detail product');

  const {
    params: { name }
  } = req;

  const filterProduct = await getDetailProductDB(name);

  logger.info(typeof filterProduct);
  console.log(filterProduct);

  if (filterProduct.length === 0) {
    logger.info('Data not found');
    return res.status(404).send({
      stattus: false,
      statusCode: 404,
      message: 'Data not found'
    });
  }

  logger.info(filterProduct);

  return res.status(200).send({
    stattus: true,
    statusCode: 200,
    data: filterProduct
  });
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  logger.info('access post route product');
  logger.info(`Request body : ${JSON.stringify(req.body)}`);

  const { error } = createProductValidation(req.body);

  if (error) {
    logger.error('ERR : product - create', error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  logger.info('Success add new product');

  return res.status(200).send({
    stattus: true,
    statusCode: 200,
    message: 'Add product sucess',
    data: req.body
  });
};
