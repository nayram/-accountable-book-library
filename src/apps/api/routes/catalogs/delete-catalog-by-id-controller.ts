import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound } from '@api/errors/http-error';
import { BookDoesNotExistsError } from '@modules/catalogs/domain/book-does-not-exist-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { DeleteCatalogByBookIdUseCase } from '@modules/catalogs/application/delete-catalog-by-book-id';

export function deleteCatalogByIdControllerBuilder({
  deleteCatalogByBookId,
}: {
  deleteCatalogByBookId: DeleteCatalogByBookIdUseCase;
}) {
  return async function deleteCatalogByIdController(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteCatalogByBookId({ id: req.params.id });
      res.sendStatus(StatusCodes.NO_CONTENT);
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
