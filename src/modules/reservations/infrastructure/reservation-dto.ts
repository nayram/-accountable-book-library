import { Schema } from 'mongoose';

import { ReservationDTO } from '@modules/shared/reservations/infrastructure/reservation-model';

import { Reservation } from '../domain/reservation/reservation';

export function toDTO(reservation: Reservation): ReservationDTO {
  return {
    _id: reservation.id as unknown as Schema.Types.UUID,
    user_id: reservation.userId as unknown as Schema.Types.UUID,
    book_id: reservation.bookId as unknown as Schema.Types.UUID,
    reference_id: reservation.referenceId as unknown as Schema.Types.UUID,
    status: reservation.status,
    reservation_fee: reservation.reservationFee,
    late_fee: reservation.lateFee,
    returned_at: reservation.returnedAt,
    borrowed_at: reservation.borrowedAt,
    due_at: reservation.dueAt,
    reserved_at: reservation.reservedAt,
  };
}

export function fromDTO(dto: ReservationDTO): Reservation {
  return {
    id: String(dto._id),
    userId: String(dto.user_id),
    bookId: String(dto.book_id),
    referenceId: String(dto.reference_id),
    status: dto.status,
    reservationFee: dto.reservation_fee,
    lateFee: dto.late_fee,
    returnedAt: dto.returned_at,
    dueAt: dto.due_at,
    borrowedAt: dto.borrowed_at,
    reservedAt: dto.reserved_at,
  };
}
