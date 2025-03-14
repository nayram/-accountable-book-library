import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { CreateReferenceUseCase } from '@modules/references/application/create-reference';
import { ReferenceAlreadyExistsError } from '@modules/references/domain/reference-already-exists-error';

import { PostCreateReferenceRequest } from './post-create-reference-request';
import { toDTO } from './dto/reference-dto';

export function postCreateReferenceControllerBuilder({ createReference }: { createReference: CreateReferenceUseCase }) {
  return async function postCreateReferenceController(
    req: PostCreateReferenceRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { body } = req;
      const reference = await createReference(body);
      res.status(StatusCodes.CREATED).send(toDTO(reference));
    } catch (error) {
      if (error instanceof FieldValidationError || error instanceof ReferenceAlreadyExistsError) {
        next(BadRequest(error.message));
      } else {
        next(error);
      }
    }
  };
}
