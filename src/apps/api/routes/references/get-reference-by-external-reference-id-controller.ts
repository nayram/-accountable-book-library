import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, NotFound } from '@api/errors/http-error';
// eslint-disable-next-line max-len
import { FindReferenceByExternalReferenceIdUseCase } from '@modules/references/application/find-reference-by-external-reference-id';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { ReferenceDoesNotExistsError } from '@modules/references/domain/reference-does-not-exists-error';

import { toDTO } from './dto/reference-dto';

export function getReferenceByExternalReferenceIdControllerBuilder({
  findReferenceByExternalReferenceId,
}: {
  findReferenceByExternalReferenceId: FindReferenceByExternalReferenceIdUseCase;
}) {
  return async function getReferenceByExternalReferenceIdController(req: Request, res: Response, next: NextFunction) {
    try {
      const reference = await findReferenceByExternalReferenceId({
        externalReferenceId: req.params.externalReferenceId,
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
