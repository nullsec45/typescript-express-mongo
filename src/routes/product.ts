import { Router, type Request, type Response, type NextFunction } from 'express';
import { logger } from '../utils/logger';

export const ProductRouter: Router = Router();

ProductRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('access get route product');

  res.status(200).send({
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

  res.status(200).send({
    stattus: true,
    statusCode: 200,
    data: req.body
  });
});
