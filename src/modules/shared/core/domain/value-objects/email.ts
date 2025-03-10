import { FieldValidationError } from '../field-validation-error';

export type Email = string;

export function createEmail(value: string, fieldName: string) {
  if (!isValidEmail(value.trim())) {
    throw new FieldValidationError(`${fieldName} should be a valid email address`);
  }

  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}
