import {
  borrowBook,
  createReservation,
  findReservations,
  returnBook,
  findReservationById,
} from '@modules/reservations/applications';

import { postCreateReservationControllerBuilder } from './post-create-reservation-controller';
import { getReservationsControllerBuilder } from './get-reservations-controller';
import { postBorrowBookControllerBuilder } from './post-borrow-book-controller';
import { postReturnBookControllerBuilder } from './post-return-book-controller';
import { getReservationControllerBuilder } from './get-reservation-controller';

export const postCreateReservationController = postCreateReservationControllerBuilder({ createReservation });

export const getReservationsController = getReservationsControllerBuilder({ findReservations });

export const postBorrowBookController = postBorrowBookControllerBuilder({ borrowBook });

export const postReturnBookController = postReturnBookControllerBuilder({ returnBook });

export const getReservationController = getReservationControllerBuilder({ findReservationById });
