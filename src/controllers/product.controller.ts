import { type Request, type Response, type NextFunction } from 'express';
import { createProductValidation, updateProductValidation } from '../validations/product.validation';
import { logger } from '../utils/logger';
import { getDetailProductDB, getProductDB, addProductDB, updateProductDB } from '../services/product.service';
import { v4 as uuidv4 } from 'uuid';

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
    params: { productId }
  } = req;

  const filterProduct = await getDetailProductDB(productId);

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

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('access post route product');
  logger.info(`Request body : ${JSON.stringify(req.body)}`);
  req.body.product_id = uuidv4();

  const { error, value } = createProductValidation(req.body);

  if (error) {
    logger.error('ERR : product - create', error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    await addProductDB(value);
    logger.info('Success add new product');

    return res.status(200).send({
      stattus: true,
      statusCode: 200,
      message: 'Add product sucess'
    });
  } catch (error) {
    logger.error('ERR : product - create', error);

    return res.status(422).send({
      stattus: true,
      statusCode: 422,
      message: 'Add product failed : ' + error
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const {
    params: { productId }
  } = req;

  const { error, value } = updateProductValidation(req.body);

  if (error) {
    logger.error('ERR : product - create', error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    logger.info('Success update product');

    const result = await updateProductDB(productId, value);

    if (!result) {
      return res.status(404).send({ status: false, statusCode: 404, message: 'product id not found' });
    }

    return res.status(200).send({ status: true, statusCode: 200, message: 'update product success' });
  } catch (error) {
    logger.error('ERR : product - update', error);

    return res.status(422).send({
      stattus: true,
      statusCode: 422,
      message: 'Add product failed :' + error
    });
  }
};
