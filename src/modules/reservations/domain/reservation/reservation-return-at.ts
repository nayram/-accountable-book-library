import { createISODate, ISODate } from '@modules/shared/core/domain/value-objects/iso-date';

export type ReservationReturnAt = ISODate;

export function createReservationReturnAt(value: string): ReservationReturnAt {
  const res = createISODate(value, 'dueAt');
  return res;
}
