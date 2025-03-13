import { Reservation } from './reservation/reservation';
import { SearchParams } from './search-params';
import { ReservationId } from './reservation/reservation-id';

export interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findBySearchParams(searchParams: SearchParams): Promise<Reservation[]>;
  findById(id: ReservationId): Promise<Reservation>;
  streamUpcomingDueDateReservations(): AsyncIterableIterator<Reservation>;
  streamLateReturnReservations(): AsyncIterableIterator<Reservation>;
}
