import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, NotFound } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { CreateBookUseCase } from '@modules/books/application/create-book';
import { BookAlreadyExistsError } from '@modules/books/domain/book-already-exists-error';
import { ReferenceDoesNotExistsError } from '@modules/shared/references/domain/reference-does-not-exists-error';

import { PostCreateBookRequest } from './post-create-book-request';

export function postCreateBookControllerBuilder({ createBook }: { createBook: CreateBookUseCase }) {
  return async function postCreateBookController(req: PostCreateBookRequest, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const book = await createBook(body);
      res.status(StatusCodes.CREATED).send(book);
    } catch (error) {
      if (error instanceof FieldValidationError || error instanceof BookAlreadyExistsError) {
        next(BadRequest(error.message));
      } else if (error instanceof ReferenceDoesNotExistsError) {
        next(NotFound(error.message));
      } else {
        next(error);
      }
    }
  };
}
