import express from 'express';
import cors from 'cors';

import routes from './routes';
import {
  errorHandler,
  errorStatusHandler,
  notFoundHandler,
  serverErrorHandler,
  joiErrorHandler,
  printInternalErrorHandler,
} from './errors/handlers';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', routes);

app.use(joiErrorHandler, notFoundHandler, serverErrorHandler);
app.use(errorStatusHandler);
app.use(printInternalErrorHandler);
app.use(errorHandler);

export default app;
