import { walletRepository } from '@modules/shared/wallets/infrastructure';
import { referenceRepository } from '@modules/shared/references/infrastructure';
import { userRepository } from '@modules/shared/users/infrastructure';
import { bookRepository } from '@modules/shared/books/infrastructure';
import { uuidV4Generator } from '@modules/shared/core/infrastructure/uuid-v4-generator';

import { createReservationRepository, reservationRepository } from '../infrastructure';

import { createReservationBuilder } from './create-reservation';
import { findReservationsBuilder } from './find-reservations';

export const createReservation = createReservationBuilder({
  walletRepository,
  referenceRepository,
  userRepository,
  bookRepository,
  createReservationRepository,
  uuidGenerator: uuidV4Generator,
});

export const findReservations = findReservationsBuilder({ reservationRepository });
