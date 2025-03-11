import { walletRepository } from '@modules/shared/wallets/infrastructure';
import { userRepository } from '@modules/shared/users/infrastructure';
import { uuidGenerator } from '@modules/shared/core/infrastructure';
import { getBookById } from '@modules/books/application';
import { findReferenceById } from '@modules/references/application';

import { reservationTransactionsRepository, reservationRepository } from '../infrastructure';

import { createReservationBuilder } from './create-reservation';
import { findReservationsBuilder } from './find-reservations';
import { borrowBookBuilder } from './borrow-book';
import { returnBookBuilder } from './return-book';
import { calculateLateFeesBuilder } from './calculate-late-fees';
import { findReservationByIdBuilder } from './find-reservation-by-id';

export const createReservation = createReservationBuilder({
  walletRepository,
  userRepository,
  reservationRepository,
  getBookById,
  reservationTransactionsRepository,
  uuidGenerator,
});

export const findReservations = findReservationsBuilder({ reservationRepository });

export const borrowBook = borrowBookBuilder({
  reservationRepository,
  reservationTransactionsRepository,
  userRepository,
  getBookById,
});

export const returnBook = returnBookBuilder({
  reservationRepository,
  reservationTransactionsRepository,
  walletRepository,
  getBookById,
});

export const calculateLateFees = calculateLateFeesBuilder({
  reservationRepository,
  walletRepository,
  reservationTransactionsRepository,
  findReferenceById,
  getBookById,
});

export const findReservationById = findReservationByIdBuilder({ reservationRepository });
