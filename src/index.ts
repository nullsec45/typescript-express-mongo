import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();
const port: Number = 4000;

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello World' });
});
app.listen(port, () => console.log(`Server berjalan pada port ${port}`));
