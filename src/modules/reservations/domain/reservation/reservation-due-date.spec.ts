import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { createReservationDueAt } from './reservation-due-at';

describe('createDueAt', () => {
  it('should throw a FieldValidationError if the provided value is not a valid date', () => {
    const invalidDate = 'not a date';
    // @ts-expect-error - Testing runtime type checking
    expect(() => createReservationDueAt(invalidDate)).toThrow(FieldValidationError);
    // @ts-expect-error - Testing runtime type checking
    expect(() => createReservationDueAt(invalidDate)).toThrow(`${invalidDate} must be a valid date`);
  });

  it('should throw a FieldValidationError if the provided date is not at least 2 days in the future', () => {
    const invalidDueDate = new Date();
    invalidDueDate.setDate(invalidDueDate.getDate() + 1);
    expect(() => createReservationDueAt(invalidDueDate)).toThrow(FieldValidationError);
    expect(() => createReservationDueAt(invalidDueDate)).toThrow(`${invalidDueDate} should be 2 days or more`);
  });

  it('should return a Date object when a valid date at least 2 days in the future is provided', () => {
    const validDueDate = new Date();
    validDueDate.setDate(validDueDate.getDate() + 3);

    const result = createReservationDueAt(validDueDate);

    expect(result).toBe(validDueDate);
  });
});
