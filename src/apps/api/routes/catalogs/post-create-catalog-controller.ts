import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { CreateCatalogUseCase } from '@modules/catalogs/application/create-catalog';
import { BookAlreadyExistsError } from '@modules/catalogs/domain/book-already-exists-error';

import { PostCreateCatalogRequest } from './post-create-catalog-request';

export function postCreateCatalogControllerBuilder({ createCatalog }: { createCatalog: CreateCatalogUseCase }) {
  return async function postCreateCatalogController(req: PostCreateCatalogRequest, res: Response, next: NextFunction) {
    try {
      const catalog = await createCatalog(req.body);
      res.status(StatusCodes.CREATED).send(catalog);
    } catch (error) {
      if (error instanceof FieldValidationError || error instanceof BookAlreadyExistsError) {
        next(BadRequest(error.message));
      } else {
        next(error);
      }
    }
  };
}
