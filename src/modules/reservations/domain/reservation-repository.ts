import { Reservation } from './reservation/reservation';

export interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
}
