import { logger } from './utils/logger';

// connect to db
import './utils/connectDB';
import createServer from './utils/server';

const app = createServer();
const port: number = 4000;

app.listen(port, () => {
  logger.info(`Server berjalan pada port ${port}`);
});
