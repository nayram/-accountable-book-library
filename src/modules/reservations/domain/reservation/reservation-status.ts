import { createEnumValue } from '@modules/shared/core/domain/enum';

export enum ReservationStatus {
  Reserved = 'reserved',
  Borrowed = 'borrowed',
  Returned = 'returned',
  Closed = 'closed',
}

export function createReservationStatus(value: string): ReservationStatus {
  return createEnumValue<ReservationStatus>(value, ReservationStatus, 'reservation status');
}
