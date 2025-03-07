import { walletRepository } from '@modules/shared/wallets/infrastructure';
import { referenceRepository } from '@modules/shared/references/infrastructure';
import { userRepository } from '@modules/shared/users/infrastructure';
import { bookRepository } from '@modules/shared/books/infrastructure';
import { uuidGenerator } from '@modules/shared/core/infrastructure';

import { createReservationRepository, reservationRepository } from '../infrastructure';

import { createReservationBuilder } from './create-reservation';
import { findReservationsBuilder } from './find-reservations';

export const createReservation = createReservationBuilder({
  walletRepository,
  referenceRepository,
  userRepository,
  bookRepository,
  createReservationRepository,
  uuidGenerator,
});

export const findReservations = findReservationsBuilder({ reservationRepository });
