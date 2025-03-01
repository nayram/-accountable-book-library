import { StatusCodes } from 'http-status-codes';
import { ExpressJoiError } from 'express-joi-validation';
import { Request, Response, NextFunction } from 'express';

import { BadRequest, HttpError, InternalServerError, NotFound, isHttpError, hasStatusCode } from './http-error';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(NotFound(`Cannot ${req.method} ${req.path}`));
}

export function serverErrorHandler(error: Error, _req: Request, _res: Response, next: NextFunction): void {
  if (isHttpError(error)) {
    next(error);
  } else {
    next(InternalServerError(error));
  }
}

export function errorStatusHandler(error: HttpError, _req: Request, res: Response, next: NextFunction): void {
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);

  next(error);
}

export function printInternalErrorHandler(error: Error, req: Request, _res: Response, next: NextFunction): void {
  // We don't want to log errors when running tests
  if (isHttpError(error) && hasStatusCode(error, StatusCodes.INTERNAL_SERVER_ERROR)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorization, ...headers } = req.headers;
    console.error(
      JSON.stringify({
        stack: error.stack,
        method: req.method,
        url: req.originalUrl,
        headers,
        body: req.body,
      }),
    );
  }
  next(error);
}

export function errorHandler(
  error: HttpError,
  _req: Request,
  res: Response<HttpError>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  res.send(error);
}

export function joiErrorHandler(err: ExpressJoiError, req: Request, res: Response, next: NextFunction): void {
  if (err.error?.isJoi) {
    const e: ExpressJoiError = err;
    next(BadRequest(e.error.message));
  } else {
    next(err);
  }
}
