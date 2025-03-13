import { ReservationRepository } from '../domain/reservation-repository';
import { ReservationModel } from '../../shared/reservations/infrastructure/reservation-model';
import { ReservationDoesNotExistError } from '../../shared/reservations/domain/reservation-does-not-exist';
import { ReservationStatus } from '../domain/reservation/reservation-status';

import { fromDTO, toDTO } from './reservation-dto';

export function reservationRepositoryBuilder({ model }: { model: ReservationModel }): ReservationRepository {
  return {

    async findBySearchParams(searchParams) {
      const filter: Record<string, unknown> = {};

      if (searchParams.referenceId) {
        filter.reference_id = searchParams.referenceId;
      }

      if (searchParams.userId) {
        filter.user_id = searchParams.userId;
      }

      if (searchParams.status) {
        filter.status = searchParams.status;
      }

      const reservations = await model.find(filter);

      return reservations.map(fromDTO);
    },

    async findById(id) {
      const reservation = await model.findById(id);
      if (!reservation) {
        throw new ReservationDoesNotExistError(id);
      }
      return fromDTO(reservation);
    },

    async save(reservation) {
      const existingReservation = await model.findById(reservation.id);
      if (existingReservation) {
        await model.updateOne(
          {
            _id: reservation.id,
          },
          {
            $set: {
              status: reservation.status,
              returned_at: reservation.returnedAt ? new Date(reservation.returnedAt) : null,
              due_at: reservation.dueAt ? new Date(reservation.dueAt) : null,
              late_fee: reservation.lateFee,
              reservation_fee: reservation.reservationFee,
              borrowed_at: reservation.borrowedAt,
            },
          },
        );
      } else {
        await model.create(toDTO(reservation));
      }
    },
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
