import { StatusCodes } from 'http-status-codes';

export interface HttpError {
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHttpError(error: any): error is HttpError {
  return error.status && error.statusCode && error.message;
}

export function hasStatusCode(error: HttpError, statusCode: StatusCodes): boolean {
  return error.statusCode === statusCode;
}

export function NotFound(message: string): HttpError {
  return {
    status: 'Not Found',
    statusCode: StatusCodes.NOT_FOUND,
    message,
  };
}

export function Conflict(message: string): HttpError {
  return {
    status: 'Conflict',
    statusCode: StatusCodes.CONFLICT,
    message,
  };
}

export function BadRequest(message: string): HttpError {
  return {
    status: 'Bad Request',
    statusCode: StatusCodes.BAD_REQUEST,
    message,
  };
}

export function InternalServerError(error: Error): HttpError {
  return {
    status: 'Internal Server Error',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong',
    stack: error.stack,
  };
}

export function PaymentRequired(message: string): HttpError {
  return {
    status: 'Payment Required',
    statusCode: StatusCodes.PAYMENT_REQUIRED,
    message,
  };
}
