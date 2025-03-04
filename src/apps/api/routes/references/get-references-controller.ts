import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FindReferencesUseCase } from '@modules/references/application/find-references';

import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { BadRequest } from '@api/errors/http-error';

import { GetReferencesRequest } from './get-references-request';
import { toDTO } from './dto/reference-dto';

export function getReferencesControllerBuilder({ findReferences }: { findReferences: FindReferencesUseCase }) {
  return async function getReferencesController(req: GetReferencesRequest, res: Response, next: NextFunction) {
    try {
      const { data, ...rest } = await findReferences(req.query);
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
