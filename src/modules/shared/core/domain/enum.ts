import { FieldValidationError } from './field-validation-error';

export function isValueInEnum<Enum>(value: unknown, enumerator: Record<string, unknown>): value is Enum {
  for (const key in enumerator) {
    if (enumerator[key] === value) {
      return true;
    }
  }
  return false;
}

export function createEnumValue<Enum>(value: unknown, enumerator: Record<string, unknown>, fieldName: string): Enum {
  if (!isValueInEnum<Enum>(value, enumerator)) {
    throw new FieldValidationError(`${fieldName} must be one of ${Object.values(enumerator)}`);
  }

  return value;
}
