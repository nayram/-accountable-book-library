import { userRepository } from '@modules/shared/users/infrastructure';
import { reservationRepository } from '@modules/reservations/infrastructure';
import { findReferenceById } from '@modules/references/application';
import { calculateLateFees } from '@modules/reservations/applications';
import { queueService } from '@modules/shared/core/infrastructure';

import { processLateReturnsBuilder } from './process-late-returns';

export const processLateReturns = processLateReturnsBuilder({
  userRepository: userRepository,
  reservationRepository: reservationRepository,
  findReferenceById,
  calculateLateFees,
  queueService,
});
