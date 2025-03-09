import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

export type BorrowDueDate = Date;

function isValidDueDate(dueDate: Date): boolean {
  const now = new Date();
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
  const timeDifference = dueDate.getTime() - now.getTime();

  return timeDifference >= twoDaysInMilliseconds;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidDate(value: any): boolean {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  return false;
}

export function createBorrowDueData(value: Date): BorrowDueDate {
  if (!isValidDate(value)) {
    throw new FieldValidationError(`${value} must be a valid date`);
  }
  if (!isValidDueDate(value)) {
    throw new FieldValidationError(`${value} should be 2 days or more`);
  }
  return value;
}
