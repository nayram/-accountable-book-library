import {
  borrowBook,
  createReservation,
  returnBook,
  findReservationById,
  findReservationsByUserId,
} from '@modules/reservations/applications';

import { postCreateReservationControllerBuilder } from './post-create-reservation-controller';
import { postBorrowBookControllerBuilder } from './post-borrow-book-controller';
import { postReturnBookControllerBuilder } from './post-return-book-controller';
import { getReservationControllerBuilder } from './get-reservation-controller';
import { getReservationsByUserIdControllerBuilder } from './get-reservations-by-userId-controller';

export const postCreateReservationController = postCreateReservationControllerBuilder({ createReservation });

export const postBorrowBookController = postBorrowBookControllerBuilder({ borrowBook });

export const postReturnBookController = postReturnBookControllerBuilder({ returnBook });

export const getReservationController = getReservationControllerBuilder({ findReservationById });

export const getReservationsByUserIdController = getReservationsByUserIdControllerBuilder({ findReservationsByUserId });
