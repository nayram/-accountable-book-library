import { userRepository } from '@modules/shared/users/infrastructure';
import { reservationRepository } from '@modules/reservations/infrastructure';
import { findReferenceById } from '@modules/references/application';
import { calculateLateFees } from '@modules/reservations/applications';
import { queueService } from '@modules/shared/core/infrastructure';
import { QUEUE_EMAIL_SERVICE_TOPIC } from '@modules/shared/core/domain/queue-service';

import { processLateReturnsBuilder } from './process-late-returns';

queueService.create(QUEUE_EMAIL_SERVICE_TOPIC);
export const processLateReturns = processLateReturnsBuilder({
  userRepository: userRepository,
  reservationRepository: reservationRepository,
  findReferenceById,
  calculateLateFees,
  queueService,
});
