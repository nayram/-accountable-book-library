import { walletRepository } from '@modules/shared/wallets/infrastructure';
import { userRepository } from '@modules/shared/users/infrastructure';
import { uuidGenerator } from '@modules/shared/core/infrastructure';
import { getBookById } from '@modules/books/application';

import { reservationTransactionsRepository, reservationRepository } from '../infrastructure';

import { createReservationBuilder } from './create-reservation';
import { findReservationsBuilder } from './find-reservations';

export const createReservation = createReservationBuilder({
  walletRepository,
  userRepository,
  reservationRepository,
  getBookById,
  reservationTransactionsRepository,
  uuidGenerator,
});

export const findReservations = findReservationsBuilder({ reservationRepository });
