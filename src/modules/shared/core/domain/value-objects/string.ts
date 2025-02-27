import { FieldValidationError } from '../field-validation-error';

function isEmpty(value: string) {
  return value.length === 0;
}

export function createString(string: string, fieldName: string) {
  if (isEmpty(string.trim())) {
    throw new FieldValidationError(`${fieldName} must be a non-empty string`);
  }

  return string.trim();
}
