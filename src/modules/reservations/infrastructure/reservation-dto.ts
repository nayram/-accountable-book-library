import { Schema } from 'mongoose';

import { ReservationDTO } from '@modules/shared/reservations/infrastructure/reservation-model';
import { convertDateToISODateString } from '@modules/shared/core/domain/value-objects/iso-date';

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
    returned_at: reservation.returnedAt ? new Date(reservation.returnedAt) : null,
    borrowed_at: reservation.borrowedAt,
    due_at: reservation.dueAt ? new Date(reservation.dueAt) : null,
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
    returnedAt: dto.returned_at ? convertDateToISODateString(dto.returned_at) : null,
    dueAt: dto.due_at ? convertDateToISODateString(dto.due_at) : null,
    borrowedAt: dto.borrowed_at,
    reservedAt: dto.reserved_at,
  };
}
