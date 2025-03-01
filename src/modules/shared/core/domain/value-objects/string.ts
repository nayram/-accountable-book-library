import { FieldValidationError } from '../field-validation-error';

function isEmpty(value: string) {
  return value.length === 0;
}

function isNotAString(value: string) {
  return typeof value != 'string';
}

export function createString(value: string, fieldName: string) {
  if (isNotAString(value)) {
    throw new FieldValidationError(`${fieldName} must be  a valid string`);
  }

  if (isEmpty(value.trim())) {
    throw new FieldValidationError(`${fieldName} must be a non-empty string`);
  }

  return value.trim();
}
