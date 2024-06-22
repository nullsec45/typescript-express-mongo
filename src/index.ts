import express, { type Application, type Response } from 'express';
import { routes } from './routes';
import { logger } from './utils/logger';
import bodyParser from 'body-parser';
import cors from 'cors';

const app: Application = express();
const port: number = 4000;

// parse body request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes(app);

// cors access handler
app.use(cors());
app.use((req, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.listen(port, () => {
  logger.info(`Server berjalan pada port ${port}`);
});
