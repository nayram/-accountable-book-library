import { reservationModel } from './reservation-model';
import { reservationRepositoryBuilder } from './reservation-repository';

export const reservationRepository = reservationRepositoryBuilder({ model: reservationModel });
