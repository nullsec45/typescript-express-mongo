import { Router, type Request, type Response, type NextFunction } from 'express';
import { createProductValidation } from '../validations/product.validation';
import { logger } from '../utils/logger';

export const ProductRouter: Router = Router();

ProductRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('access get route product');

  return res.status(200).send({
    stattus: true,
    statusCode: 200,
    data: [
      {
        name: 'Sepatu Sport',
        price: 500000
      }
    ]
  });
});

ProductRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
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
});
