import { reservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';

import { reservationRepositoryBuilder } from './reservation-repository';

export const reservationRepository = reservationRepositoryBuilder({ model: reservationModel });
