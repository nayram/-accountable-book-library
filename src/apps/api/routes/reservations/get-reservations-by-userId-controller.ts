import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FindReservationsByUserIdUseCase } from '@modules/reservations/applications/find-reservations-by-userId';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { BadRequest, NotFound } from '@api/errors/http-error';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';

export function getReservationsByUserIdControllerBuilder({
  findReservationsByUserId,
}: {
  findReservationsByUserId: FindReservationsByUserIdUseCase;
}) {
  return async function getReservationsByUserIdController(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['authorization'];

      if (userId) {
        const reservations = await findReservationsByUserId({ userId });
        res.status(StatusCodes.OK).send(reservations);
      } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
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
