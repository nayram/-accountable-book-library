import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { createBorrowDueData } from './borrow-due-date';

describe('createBorrowDueData', () => {
  it('should throw a FieldValidationError if the provided value is not a valid date', () => {
    const invalidDate = 'not a date';
    // @ts-expect-error - Testing runtime type checking
    expect(() => createBorrowDueData(invalidDate)).toThrow(FieldValidationError);
    // @ts-expect-error - Testing runtime type checking
    expect(() => createBorrowDueData(invalidDate)).toThrow(`${invalidDate} must be a valid date`);
  });

  it('should throw a FieldValidationError if the provided date is not at least 2 days in the future', () => {
    const invalidDueDate = new Date();
    invalidDueDate.setDate(invalidDueDate.getDate() + 1);
    expect(() => createBorrowDueData(invalidDueDate)).toThrow(FieldValidationError);
    expect(() => createBorrowDueData(invalidDueDate)).toThrow(`${invalidDueDate} should be 2 days or more`);
  });

  it('should return a Date object when a valid date at least 2 days in the future is provided', () => {
    const validDueDate = new Date();
    validDueDate.setDate(validDueDate.getDate() + 3);

    const result = createBorrowDueData(validDueDate);

    expect(result).toBe(validDueDate);
  });
});
