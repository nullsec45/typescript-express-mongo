import { Router, type Request, type Response, type NextFunction } from 'express';
import { logger } from '../utils/logger';
import { requireUser } from '../middleware/auth';

export const HealthRouter: Router = Router();

HealthRouter.get('/', requireUser, (req: Request, res: Response, next: NextFunction) => {
  logger.info('access get route health');

  res.status(200).send({ data: 'Hello World' });
});
