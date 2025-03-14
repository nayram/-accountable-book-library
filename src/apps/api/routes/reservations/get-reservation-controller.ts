import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { BadRequest, NotFound } from '@api/errors/http-error';
import { FindReservationByIdUseCase } from '@modules/reservations/applications/find-reservation-by-id';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';

export function getReservationControllerBuilder({
  findReservationById,
}: {
  findReservationById: FindReservationByIdUseCase;
}) {
  return async function getReservationController(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await findReservationById({ id: req.params.id });
      res.status(StatusCodes.OK).send(reservation);
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else if (error instanceof ReservationDoesNotExistError) {
        next(NotFound(error.message));
      } else {
        next(error);
      }
    }
  };
}
