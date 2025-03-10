import { borrowBook, createReservation, findReservations, returnBook } from '@modules/reservations/applications';

import { postCreateReservationControllerBuilder } from './post-create-reservation-controller';
import { getReservationsControllerBuilder } from './get-reservations-controller';
import { postBorrowBookControllerBuilder } from './post-borrow-book-controller';
import { postReturnBookControllerBuilder } from './post-return-book-controller';

export const postCreateReservationController = postCreateReservationControllerBuilder({ createReservation });

export const getReservationsController = getReservationsControllerBuilder({ findReservations });

export const postBorrowBookController = postBorrowBookControllerBuilder({ borrowBook });

export const postReturnBookController = postReturnBookControllerBuilder({ returnBook });
