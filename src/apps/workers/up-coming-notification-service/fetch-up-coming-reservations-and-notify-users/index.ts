import { reservationRepository } from '@modules/reservations/infrastructure';
import { userRepository } from '@modules/shared/users/infrastructure';
import { findReferenceById } from '@modules/references/application';
import { queueService } from '@modules/shared/core/infrastructure';

import { processUpcomingReservationsBuilder } from './process-up-coming-reservations';

export const processUpcomingReservations = processUpcomingReservationsBuilder({
  reservationRepository,
  userRepository,
  findReferenceById,
  queueService,
});
