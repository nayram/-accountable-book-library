import { ReservationId } from '@modules/reservations/domain/reservation/reservation-id';

export interface ReservationRepository {
  exists(id: ReservationId): Promise<void>;
}
