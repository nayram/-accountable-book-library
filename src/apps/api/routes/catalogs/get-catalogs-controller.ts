import { NextFunction, Response } from 'express';
import { FindCatalogsUseCase } from '@modules/catalogs/application/find-catalogs';
import { StatusCodes } from 'http-status-codes';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { BadRequest } from '@api/errors/http-error';

import { GetCatalogsRequest } from './get-catalogs-request';
import { toDTO } from './dto/catalogs-dto';

export function getCatalogsControllerBuilder({ findCatalogs }: { findCatalogs: FindCatalogsUseCase }) {
  return async function getCatalogsController(req: GetCatalogsRequest, res: Response, next: NextFunction) {
    try {
      const { data, ...rest } = await findCatalogs(req.query);
      res.status(StatusCodes.OK).send({ data: data.map(toDTO), ...rest });
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else {
        next(error);
      }
    }
  };
}
