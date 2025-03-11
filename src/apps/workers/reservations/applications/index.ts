import { userRepository } from '@modules/shared/users/infrastructure';
import { findReferenceById } from '@modules/references/application';
import { eventBus } from '@libs/event-bus';

import { reservationRepository } from '../infrastructure';

import { fetchUpcomingDueReservationsBuilder } from './fetch-up-coming-due-reservations';
import { fetchLateReturnReservationBuilder } from './fetch-late-return-reservations';

export const fetchUpcomingDueReservations = fetchUpcomingDueReservationsBuilder({
  reservationRepository,
  userRepository,
  findReferenceById,
  eventBus,
});

export const fetchLateReturnReservations = fetchLateReturnReservationBuilder({
  reservationRepository,
  userRepository,
  findReferenceById,
  eventBus,
});
