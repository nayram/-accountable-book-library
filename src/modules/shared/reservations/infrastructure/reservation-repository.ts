import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';

import { ReservationRepository } from '../domain/reservation-repository';

import { ReservationModel } from './reservation-model';

export function reservationRepositoryBuilder({ model }: { model: ReservationModel }): ReservationRepository {
  return {
    async exists(id) {
      const reservation = await model.findById(id);
      if (!reservation) {
        throw new ReservationDoesNotExistError(id);
      }
    },
  };
}
