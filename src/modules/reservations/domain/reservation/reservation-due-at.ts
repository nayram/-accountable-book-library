import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { createISODate, ISODate } from '@modules/shared/core/domain/value-objects/iso-date';

export type ReservationDueAt = ISODate;

function isValidDueDate(dueDate: Date): boolean {
  const now = new Date();
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
  const timeDifference = dueDate.getTime() - now.getTime();

  return timeDifference >= twoDaysInMilliseconds;
}

export function createReservationDueAt(value: string): ReservationDueAt {
  const res = createISODate(value, 'dueAt');
  if (!isValidDueDate(new Date(res))) {
    throw new FieldValidationError(`${value} should be 2 days or more`);
  }

  return res;
}
