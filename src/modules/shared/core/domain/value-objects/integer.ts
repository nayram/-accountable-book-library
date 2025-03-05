import { FieldValidationError } from '../field-validation-error';

export type Integer = number;

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function createInteger(int: number, fieldName: string): Integer {
  if (!isNumber(int)) {
    throw new FieldValidationError(`${fieldName} must be an integer`);
  }

  return int;
}
