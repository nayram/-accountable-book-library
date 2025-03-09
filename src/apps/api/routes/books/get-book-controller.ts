import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, NotFound } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { BookDoesNotExistsError } from '@modules/books/domain/book-does-not-exist-error';

export function getBookControllerBuilder({ getBookById }: { getBookById: GetBookByIdUseCase }) {
  return async function getBookController(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await getBookById({ id: req.params.id });
      res.status(StatusCodes.OK).send(book);
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else if (error instanceof BookDoesNotExistsError) {
        next(NotFound(error.message));
      } else {
        next(error);
      }
    }
  };
}
