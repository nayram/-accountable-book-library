import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { FindBooksUseCase } from '@modules/books/application/find-books';

export function getBooksControllerBuilder({ findBooks }: { findBooks: FindBooksUseCase }) {
  return async function getBooksController(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await findBooks({ referenceId: req.params.id });
      res.status(StatusCodes.OK).send(book);
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else {
        next(error);
      }
    }
  };
}
