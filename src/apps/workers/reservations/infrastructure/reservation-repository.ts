import { ReservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';
import { fromDTO } from '@modules/reservations/infrastructure/reservation-dto';
import { ReservationStatus } from '@modules/reservations/domain/reservation/reservation-status';

import { ReservationRepository } from '../domain/reservation-repository';

export function reservationRepositoryBuilder({ model }: { model: ReservationModel }): ReservationRepository {
  return {
    async *streamUpcomingDueDateReservations() {
      const now = new Date();
      const upcomingDueStart = new Date(now);
      upcomingDueStart.setHours(0, 0, 0, 0);

      const upcomingDueEnd = new Date(upcomingDueStart);
      upcomingDueEnd.setDate(upcomingDueEnd.getDate() + 2);
      upcomingDueEnd.setHours(23, 59, 59, 999);

      const query = {
        status: ReservationStatus.Borrowed,
        due_at: {
          $gte: upcomingDueStart,
          $lt: upcomingDueEnd,
        },
      };
      const cursor = model.find(query).cursor();
      for await (const reservation of cursor) {
        yield fromDTO(reservation);
      }
    },

    async *streamLateReturnReservations() {
      const now = new Date();
      const lateThreshold = new Date(now);
      lateThreshold.setDate(lateThreshold.getDate() - 7);

      const query = {
        status: ReservationStatus.Borrowed,
        due_at: { $lte: lateThreshold },
      };

      const cursor = model.find(query).cursor();
      for await (const reservation of cursor) {
        yield fromDTO(reservation);
      }
    },
  };
}
