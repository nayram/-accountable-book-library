import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FindCatalogByBookIdUseCase } from '@modules/catalogs/application/find-catalog-by-book-id';
import { BadRequest, NotFound } from '@api/errors/http-error';
import { BookDoesNotExistsError } from '@modules/catalogs/domain/book-does-not-exist-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

export function getCatalogByIdControllerBuilder({
  findCatalogByBookId,
}: {
  findCatalogByBookId: FindCatalogByBookIdUseCase;
}) {
  return async function getCatalogByIdController(req: Request, res: Response, next: NextFunction) {
    try {
      const catalog = await findCatalogByBookId({ id: req.params.id });
      res.status(StatusCodes.OK).send(catalog);
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
