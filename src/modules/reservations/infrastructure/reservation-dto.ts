import { Schema } from 'mongoose';

import { Reservation } from '../domain/reservation/reservation';

import { ReservationDTO } from '../../shared/reservations/infrastructure/reservation-model';

export function toDTO(reservation: Reservation): ReservationDTO {
  return {
    _id: reservation.id as unknown as Schema.Types.UUID,
    user_id: reservation.userId as unknown as Schema.Types.UUID,
    book_id: reservation.bookId as unknown as Schema.Types.UUID,
    reference_id: reservation.referenceId as unknown as Schema.Types.UUID,
    reserved_at: reservation.reservedAt,
  };
}

export function fromDTO(dto: ReservationDTO): Reservation {
  return {
    id: String(dto._id),
    userId: String(dto.user_id),
    bookId: String(dto.book_id),
    referenceId: String(dto.reference_id),
    reservedAt: dto.reserved_at,
  };
}
