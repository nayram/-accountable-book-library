import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { convertDateToISODateString } from '@modules/shared/core/domain/value-objects/iso-date';

import { createReservationDueAt } from './reservation-due-at';

describe('createDueAt', () => {
  it('should throw a FieldValidationError if the provided value is not a valid date', () => {
    const invalidDate = 'not a date';

    expect(() => createReservationDueAt(invalidDate)).toThrow(FieldValidationError);

    expect(() => createReservationDueAt(invalidDate)).toThrow('dueAt must be valid ISO date "YYYY-MM-DD"');
  });

  it('should return a Date object when a valid date at least 2 days in the future is provided', () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);

    const validDate = convertDateToISODateString(date);

    const result = createReservationDueAt(validDate);

    expect(result).toBe(validDate);
  });
});
