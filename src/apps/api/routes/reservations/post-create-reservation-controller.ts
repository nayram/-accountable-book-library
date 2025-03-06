import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequest, Conflict, NotFound, PaymentRequired } from '@api/errors/http-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { CreateReservationUseCase } from '@modules/reservations/applications/create-reservation';
import { ReferenceDoesNotExistsError } from '@modules/shared/references/domain/reference-does-not-exists-error';
import { UserDoesNotExistsError } from '@modules/shared/users/domain/user-does-not-exists-error';
import { ReservationFailedError } from '@modules/reservations/domain/reservation-failed-error';
import { WalletDoesNotExistsError } from '@modules/shared/wallets/domain/wallet-does-not-exists-error';
import { InsufficientFundsError } from '@modules/shared/wallets/domain/insuffiecient-funds-error';

import { PostCreateReservationRequest } from './post-create-reservation.request';

export function postCreateReservationControllerBuilder({
  createReservation,
}: {
  createReservation: CreateReservationUseCase;
}) {
  return async function postCreateReservationController(
    req: PostCreateReservationRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { body } = req;
      const reservation = await createReservation(body);
      res.status(StatusCodes.CREATED).send(reservation);
    } catch (error) {
      if (error instanceof FieldValidationError) {
        next(BadRequest(error.message));
      } else if (error instanceof ReferenceDoesNotExistsError || error instanceof UserDoesNotExistsError) {
        next(NotFound(error.message));
      } else if (error instanceof ReservationFailedError || error instanceof WalletDoesNotExistsError) {
        next(Conflict(error.message));
      } else if (error instanceof InsufficientFundsError) {
        next(PaymentRequired(error.message));
      } else {
        next(error);
      }
    }
  };
}
