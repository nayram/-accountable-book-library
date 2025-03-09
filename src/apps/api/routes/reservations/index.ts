import { borrowBook, createReservation, findReservations } from '@modules/reservations/applications';

import { postCreateReservationControllerBuilder } from './post-create-reservation-controller';
import { getReservationsControllerBuilder } from './get-reservations-controller';
import { postBorrowBookControllerBuilder } from './post-borrow-book-controller';

export const postCreateReservationController = postCreateReservationControllerBuilder({ createReservation });

export const getReservationsController = getReservationsControllerBuilder({ findReservations });

export const postBorrowBookController = postBorrowBookControllerBuilder({ borrowBook });
