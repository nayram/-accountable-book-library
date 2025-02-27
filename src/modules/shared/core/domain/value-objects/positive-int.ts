import { FieldValidationError } from '../field-validation-error';

export type PositiveInt = number;

export function createPositiveInt(int: number, fieldName: string): PositiveInt {
  if (int < 0) {
    throw new FieldValidationError(`${fieldName} must be a positive integer`);
  }

  return int;
}
