import { createISODate, ISODate } from '@modules/shared/core/domain/value-objects/iso-date';

export type ReservationDueAt = ISODate;

export function createReservationDueAt(value: string): ReservationDueAt {
  const res = createISODate(value, 'dueAt');
  return res;
}
