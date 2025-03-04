import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, NotFound } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { DeleteReferenceByIdUseCase } from '@modules/references/application/delete-reference-by-id';
import { ReferenceDoesNotExistsError } from '@modules/references/domain/reference-does-not-exists-error';

export function deleteReferenceByIdControllerBuilder({
  deleteReferenceById,
}: {
  deleteReferenceById: DeleteReferenceByIdUseCase;
}) {
  return async function deleteReferenceByIdController(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteReferenceById({ id: req.params.id });
      res.sendStatus(StatusCodes.NO_CONTENT);
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
