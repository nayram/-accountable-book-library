import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, Conflict, NotFound } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { ReservationFailedError } from '@modules/reservations/domain/reservation-failed-error';
import { BorrowBookUseCase } from '@modules/reservations/applications/borrow-book';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';

import { PostBorrowBookRequest } from './post-borrow-book-request';

export function postBorrowBookControllerBuilder({ borrowBook }: { borrowBook: BorrowBookUseCase }) {
  return async function postBorrowBookController(req: PostBorrowBookRequest, res: Response, next: NextFunction) {
    try {
      const { body } = req;

      await borrowBook({ reservationId: req.params.id, dueAt: body.dueAt, userId: req.headers['Authorization'] });

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
