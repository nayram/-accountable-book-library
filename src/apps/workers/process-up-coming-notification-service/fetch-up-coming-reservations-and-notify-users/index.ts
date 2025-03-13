import { reservationRepository } from '@modules/reservations/infrastructure';
import { userRepository } from '@modules/shared/users/infrastructure';
import { findReferenceById } from '@modules/references/application';
import { queueService } from '@modules/shared/core/infrastructure';
import { QUEUE_EMAIL_SERVICE_TOPIC } from '@modules/shared/core/domain/queue-service';

import { processUpcomingReservationsBuilder } from './process-up-coming-reservations';

queueService.create(QUEUE_EMAIL_SERVICE_TOPIC);
export const processUpcomingReservations = processUpcomingReservationsBuilder({
  reservationRepository,
  userRepository,
  findReferenceById,
  queueService,
});
