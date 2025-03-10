import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, Conflict, NotFound } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { ReservationFailedError } from '@modules/reservations/domain/reservation-failed-error';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';
import { ReturnBookUseCase } from '@modules/reservations/applications/return-book';

import { PostReturnBookRequest } from './post-return-book-request';

export function postReturnBookControllerBuilder({ returnBook }: { returnBook: ReturnBookUseCase }) {
  return async function postReturnBookController(req: PostReturnBookRequest, res: Response, next: NextFunction) {
    try {
      await returnBook({ reservationId: req.params.id, returnedAt: req.body.returnedAt });

      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else if (error instanceof ReservationDoesNotExistError) {
        next(NotFound(error.message));
      } else if (error instanceof ReservationFailedError) {
        next(Conflict(error.message));
      } else {
        next(error);
      }
    }
  };
}
