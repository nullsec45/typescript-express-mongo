import express, { type Application, type Response } from 'express';
import bodyParser from 'body-parser';
import { routes } from '../routes';
import cors from 'cors';

import deserializedToken from '../middleware/deserialized';

const createServer = () => {
  const app: Application = express();
  app.use(deserializedToken);

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

  return app;
};

export default createServer;
