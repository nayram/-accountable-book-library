import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { createReservationDueAt } from './reservation-due-at';
import { convertISOToDateString } from '@modules/shared/core/domain/value-objects/iso-date';

describe('createDueAt', () => {
  it('should throw a FieldValidationError if the provided value is not a valid date', () => {
    const invalidDate = 'not a date';

    expect(() => createReservationDueAt(invalidDate)).toThrow(FieldValidationError);

    expect(() => createReservationDueAt(invalidDate)).toThrow('dueAt must be valid ISO date "YYYY-MM-DD"');
  });

  it('should throw a FieldValidationError if the provided date is not at least 2 days in the future', () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const invalidDate = convertISOToDateString(date);

    expect(() => createReservationDueAt(invalidDate)).toThrow(FieldValidationError);
    expect(() => createReservationDueAt(invalidDate)).toThrow(`${invalidDate} should be 2 days or more`);
  });

  it('should return a Date object when a valid date at least 2 days in the future is provided', () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);

    const validDate = convertISOToDateString(date);

    const result = createReservationDueAt(validDate);

    expect(convertISOToDateString(result)).toBe(validDate);
  });
});
