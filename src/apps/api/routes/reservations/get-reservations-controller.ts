import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { BadRequest } from '@api/errors/http-error';
import { FindReservationsUseCase } from '@modules/reservations/applications/find-reservations';

import { GetReservationsRequest } from './get-reservations-request';

export function getReservationsControllerBuilder({ findReservations }: { findReservations: FindReservationsUseCase }) {
  return async function getReservationsController(req: GetReservationsRequest, res: Response, next: NextFunction) {
    try {
      const { data, ...rest } = await findReservations(req.query);
      res.status(StatusCodes.OK).send({ data, ...rest });
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else {
        next(error);
      }
    }
  };
}
