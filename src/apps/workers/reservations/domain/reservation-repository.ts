import { Reservation } from '@modules/reservations/domain/reservation/reservation';

export interface ReservationRepository {
  streamUpcomingDueDateReservations(): AsyncIterableIterator<Reservation>;
  streamLateReturnReservations(): AsyncIterableIterator<Reservation>;
}
