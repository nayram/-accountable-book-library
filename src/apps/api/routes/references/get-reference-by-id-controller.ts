import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, NotFound } from '@api/errors/http-error';
import { FindReferenceByIdUseCase } from '@modules/references/application/find-reference-by-id';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { ReferenceDoesNotExistsError } from '@modules/references/domain/reference-does-not-exists-error';

import { toDTO } from './dto/reference-dto';

export function getReferenceByIdControllerBuilder({
  findReferenceById,
}: {
  findReferenceById: FindReferenceByIdUseCase;
}) {
  return async function getReferenceByIdController(req: Request, res: Response, next: NextFunction) {
    try {
      const reference = await findReferenceById({
        id: req.params.id,
      });
      res.status(StatusCodes.OK).send(toDTO(reference));
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else if (error instanceof ReferenceDoesNotExistsError) {
        next(NotFound(error.message));
      } else {
        next(error);
      }
    }
  };
}
