import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.get('/health', (_req: Request, res: Response) => {
  res.sendStatus(StatusCodes.OK);
});

export default app;
